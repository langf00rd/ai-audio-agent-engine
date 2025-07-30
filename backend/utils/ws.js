import { streamText } from "ai";
import { AssemblyAI } from "assemblyai";
import dotenv from "dotenv";
import ffmpeg from "fluent-ffmpeg";
import { PassThrough, Readable } from "stream";
import { chatModel } from "../config/ai.js";
import { getAgentByIDService } from "../services/agent.service.js";
import {
  createConversationHistory,
  getConversationHistory,
} from "../services/ai.service.js";
import { generateSystemPrompt, parseConversationSessionHistory } from "./ai.js";
import { minifyJSONForLLM } from "./index.js";
import { polly } from "../config/tts.js";
import { SynthesizeSpeechCommand } from "@aws-sdk/client-polly";
import { CONVERSATION_SYSTEM_PROMPT } from "./prompts.js";
import { createSessionService } from "../services/sessions.service.js";

dotenv.config({ path: ".env" });

const ffmpegPath = process.env.FFMPEG_PATH;
ffmpeg.setFfmpegPath(ffmpegPath);

export async function handleWebSocketConnection(ws, agentId) {
  let agent;
  let transcriberClient;
  let transcriberSessionId;

  async function init() {
    agent = minifyJSONForLLM(await handleGetAgent(agentId));
    const { transcriber, sessionId } = await initTranscriber();
    const sessionResponse = await createSessionService({
      id: sessionId,
      agent_id: agentId,
    });
    if (sessionResponse.error) throw new Error(sessionResponse.error);
    transcriberClient = transcriber;
    transcriberSessionId = sessionId;
  }

  await init()
    .then(() => {
      console.log("[transcriber and agent ready]", {
        agent,
        transcriberSessionId,
      });

      transcriberClient.on("turn", async (turn) => {
        if (turn.end_of_turn) {
          try {
            const conversationHistory =
              await handleGetConversationHistory(transcriberSessionId);
            const result = streamText({
              model: chatModel,
              system: CONVERSATION_SYSTEM_PROMPT,
              prompt: `conversation history: ${JSON.stringify(conversationHistory)}. role info: ${JSON.stringify(agent)}`,
            });
            let llmResponse = "";
            const reader = result.baseStream.getReader();
            while (true) {
              const { value, done } = await reader.read();
              if (value?.part?.type === "text") {
                llmResponse += value?.part?.text;
                ws.send(
                  JSON.stringify({
                    type: "LLM_RESPONSE",
                    llm_response: value.part.text,
                  }),
                );
              }
              if (done) break;
            }
            const audioBuffer = await ttsService(llmResponse);
            ws.send(
              JSON.stringify({
                type: "TTS_AUDIO",
                audio: audioBuffer.toString("base64"),
              }),
            );
            createConversationHistory(
              transcriberSessionId,
              agentId,
              turn.transcript,
              llmResponse,
            );
          } catch (err) {
            console.log("LLM ERR", err);
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
  const conversationHistory = await getConversationHistory(sessionId);
  return conversationHistory
    ? parseConversationSessionHistory(conversationHistory.slice(-3))
    : [];
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
    console.error("Polly TTS error:", err);
    throw err;
  }
}
