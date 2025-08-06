import { SynthesizeSpeechCommand } from "@aws-sdk/client-polly";
import { streamText } from "ai";
import { AssemblyAI } from "assemblyai";
import dotenv from "dotenv";
import ffmpeg from "fluent-ffmpeg";
import { PassThrough, Readable } from "stream";
import { chatModel } from "../config/ai.js";
import { elevenLabs, polly } from "../config/tts.js";
import { getAgentByIDService } from "../services/agent.service.js";
import { trackAgentUsageService } from "../services/analytics.service.js";
import { getBusinessesService } from "../services/business.service.js";
import {
  createConversationService,
  getConversationsService,
} from "../services/conversation.service.js";
import { createSessionService } from "../services/sessions.service.js";
import {
  MAX_CONVERSATION_CONTEXT,
  WebSocketResponseType,
} from "./constants.js";
import { minifyJSONForLLM, parseConversationSessionHistory } from "./index.js";
import { CONVERSATION_SYSTEM_PROMPT } from "./prompts.js";

dotenv.config({ path: ".env" });

const ffmpegPath = process.env.FFMPEG_PATH;
ffmpeg.setFfmpegPath(ffmpegPath);

export async function handleWebSocketConnection(ws, agentId) {
  let agent;
  let transcriberClient;
  let transcriberSessionId;
  let business;

  async function init() {
    const _agent = await handleGetAgent(agentId);
    agent = minifyJSONForLLM(_agent);
    const { transcriber, sessionId } = await initTranscriber();
    const _business = await getBusinessesService({
      id: _agent.business_id,
    });
    business = minifyJSONForLLM(_business.data);
    const sessionResponse = await createSessionService({
      id: sessionId,
      agent_id: agentId,
    });
    if (sessionResponse.error) throw new Error(sessionResponse.error);
    const analyticsResponse = await trackAgentUsageService({
      event_type: "AGENT_USAGE",
      metadata: {
        agent_id: agentId,
        session_id: sessionId,
      },
    });
    if (analyticsResponse.error) throw new Error(analyticsResponse.error);
    transcriberClient = transcriber;
    transcriberSessionId = sessionId;
  }

  await init()
    .then(() => {
      console.log("[transcriber and agent ready]", {
        agent,
        transcriberSessionId,
      });

      ws.send(
        JSON.stringify({
          type: WebSocketResponseType.AGENT_SERVICES_READY,
        }),
      );

      transcriberClient.on("turn", async (turn) => {
        if (turn.end_of_turn) {
          try {
            const conversationHistory =
              await handleGetConversationHistory(transcriberSessionId);

            const result = streamText({
              model: chatModel,
              system: CONVERSATION_SYSTEM_PROMPT,
              prompt: `past conversations: ${JSON.stringify(conversationHistory)}. about business: ${JSON.stringify(business)}. about you: ${JSON.stringify(agent)}. customer message: ${turn.transcript}`,
            });

            let llmResponse = "";
            const reader = result.baseStream.getReader();

            while (true) {
              const { value, done } = await reader.read();
              if (value?.part?.type === "text" || "text-delta") {
                llmResponse += value.part.text;
                ws.send(
                  JSON.stringify({
                    type: WebSocketResponseType.LLM_RESPONSE,
                    llm_response: value.part.text,
                  }),
                );
              }
              if (done) break;
            }

            const stream = await elevenLabs.client.textToSpeech.convert(
              elevenLabs.voiceId,
              {
                text: llmResponse,
                modelId: elevenLabs.modelId,
                output_format: "mp3_44100_64",
                voiceSettings: {
                  stability: 0.3,
                  similarityBoost: 0.75,
                },
              },
            );

            for await (const audioChunk of stream) {
              const base64 = Buffer.from(audioChunk).toString("base64");
              ws.send(
                JSON.stringify({
                  type: WebSocketResponseType.TTS_AUDIO_STREAM,
                  audio: base64,
                }),
              );
            }

            ws.send(
              JSON.stringify({
                type: WebSocketResponseType.TTS_AUDIO_STREAM_END,
              }),
            );

            createConversationService({
              session_id: transcriberSessionId,
              agent_id: agentId,
              user_input: turn.transcript,
              llm_response: llmResponse,
            });
          } catch (err) {
            console.log("LLM ERR", err);
            ws.send(
              JSON.stringify({
                type: WebSocketResponseType.LLM_PROCESSING_ERROR,
              }),
            );
          }
        }
      });

      // piping audio to transcriber stream
      const inputStream = new PassThrough();
      const ffmpegProcess = ffmpeg()
        .input(inputStream)
        .inputFormat("webm")
        .audioFrequency(16000)
        .audioChannels(1)
        .audioCodec("pcm_s16le")
        .format("s16le")
        .on("error", (err) => console.error("ffmpeg error:", err))
        .pipe();
      Readable.toWeb(ffmpegProcess).pipeTo(transcriberClient.stream());

      // transcriber events
      transcriberClient.on("error", (error) => {
        console.error("transcriber error:", error);
      });
      transcriberClient.on("close", (code, reason) =>
        console.log("transcriber session closed -> ", code, reason),
      );

      // web socket events
      ws.on("message", (data) => inputStream.write(data));
      ws.on("close", async () => {
        inputStream.end();
        await transcriberClient.close();
      });
    })
    .catch((err) => {
      console.error(err);
    });
}

async function handleGetAgent(agentId) {
  const { data: agent, error } = await getAgentByIDService(agentId);
  if (error) throw new Error(error);
  return agent;
}

async function handleGetConversationHistory(sessionId) {
  const conversationHistory = await getConversationsService({
    session_id: sessionId,
  });
  if (conversationHistory.data.length < 1) return [];
  if (conversationHistory.data.length <= MAX_CONVERSATION_CONTEXT) {
    return parseConversationSessionHistory(conversationHistory.data);
  } else {
    return parseConversationSessionHistory(
      conversationHistory.data.slice(-MAX_CONVERSATION_CONTEXT),
    );
  }
}

async function initTranscriber() {
  console.log("connecting to transcriber");
  let sessionId;
  const client = new AssemblyAI({ apiKey: process.env.ASSEMBLY_AI_API_KEY });
  const transcriber = client.streaming.transcriber({
    sampleRate: 16_000,
  });
  transcriber.on("open", ({ id }) => {
    sessionId = id;
    console.log("new transcriber session", id);
  });
  await transcriber.connect();
  return { transcriber, sessionId };
}

async function ttsService(text) {
  try {
    const command = new SynthesizeSpeechCommand({
      OutputFormat: "mp3",
      Text: text,
      VoiceId: "Matthew",
      Engine: "neural",
    });
    const { AudioStream } = await polly.send(command);
    if (!AudioStream) throw new Error("No audio stream from Polly");
    const chunks = [];
    for await (const chunk of AudioStream) {
      chunks.push(chunk);
    }
    return Buffer.concat(chunks);
  } catch (err) {
    console.error("polly tts error:", err);
    throw err;
  }
}
