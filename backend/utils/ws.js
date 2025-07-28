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

dotenv.config({ path: ".env" });

const ffmpegPath = process.env.FFMPEG_PATH;
ffmpeg.setFfmpegPath(ffmpegPath);

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

export async function handleWebSocketConnection(ws, agentId) {
  let agent;
  let transcriberClient;
  let transcriberSessionId;

  async function init() {
    agent = minifyJSONForLLM(await handleGetAgent(agentId));
    const { transcriber, sessionId } = await initTranscriber();
    transcriberClient = transcriber;
    transcriberSessionId = sessionId;
  }

  await init().then(() => {
    console.log(
      "[transcriber and agent ready]",
      agent,
      transcriberSessionId,
      transcriberClient.params,
    );

    transcriberClient.on("turn", async (turn) => {
      if (turn.end_of_turn) {
        try {
          const conversationHistory =
            await handleGetConversationHistory(transcriberSessionId);
          const prompt = generateSystemPrompt(
            turn.transcript,
            "REGULAR-CONVERSATION",
            {
              agentInfo: agent,
              history: conversationHistory,
            },
          );
          const result = streamText({
            prompt,
            model: chatModel,
            system: "use less words",
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
  });
}

async function handleGetAgent(agentId) {
  const { data: agent, error } = await getAgentByIDService(agentId);
  if (error) throw new Error(error);
  return agent;
}

async function handleGetConversationHistory(sessionId) {
  console.log("transcriberSessionId", sessionId);
  const conversationHistory = await getConversationHistory(sessionId);
  return conversationHistory
    ? parseConversationSessionHistory(conversationHistory.slice(-3))
    : [];
}
