import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import { AssemblyAI } from "assemblyai";
import recorder from "node-record-lpcm16";
import { Readable } from "stream";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const PORT = 8000;
const app = express();
const server = http.createServer(app);

const wss = new WebSocketServer({ server, path: "/ws" });

const client = new AssemblyAI({ apiKey: process.env.ASSEMBLY_AI_API_KEY });

wss.on("connection", async (ws) => {
  console.log("client connected, creating streaming session");

  const transcriber = client.streaming.transcriber({
    sampleRate: 16_000,
    formatTurns: true,
  });

  transcriber.on("open", ({ id }) => {
    console.log(`transcriber session ID: ${id}`);
  });

  transcriber.on("error", (error) => {
    console.error("transcriber error:", error);
  });

  transcriber.on("close", (code, reason) =>
    console.log("transcriber session closed:", code, reason),
  );

  transcriber.on("turn", (turn) => {
    if (!turn.transcript) return;
    ws.send(JSON.stringify({ data: turn.transcript }));
  });

  try {
    console.log("connecting to streaming transcript service");

    await transcriber.connect();

    console.log("starting recording");

    const recording = recorder.record({
      channels: 1,
      sampleRate: 16_000,
      audioType: "wav",
    });

    Readable.toWeb(recording.stream()).pipeTo(transcriber.stream());

    process.on("SIGINT", async function () {
      console.log("stopping recording");
      console.log("closing streaming transcript connection");
      await transcriber.close();
      process.exit();
    });
  } catch (error) {
    console.error(error);
  }
});

app.get("/", (_, res) => {
  res.send("assembly ai audio streaming server");
});

server.listen(PORT, () => console.log(`listening on port ${PORT}`));
