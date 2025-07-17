import { AssemblyAI } from "assemblyai";
import dotenv from "dotenv";
import express from "express";
import ffmpegPath from "ffmpeg-static";
import ffmpeg from "fluent-ffmpeg";
import http from "http";
import { PassThrough, Readable } from "stream";
import { WebSocketServer } from "ws";

ffmpeg.setFfmpegPath(ffmpegPath);

dotenv.config({ path: ".env" });

const PORT = 8000;
const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: "/ws" });

wss.on("connection", async (ws) => {
  console.log("client connected");

  const client = new AssemblyAI({ apiKey: process.env.ASSEMBLY_AI_API_KEY });

  const transcriber = client.streaming.transcriber({
    sampleRate: 16_000,
    formatTurns: true,
  });

  transcriber.on("open", ({ id }) => {
    console.log(`session opened -> ${id}`);
  });

  transcriber.on("error", (error) => {
    console.error("Error:", error);
  });

  transcriber.on("close", (code, reason) =>
    console.log("Session closed:", code, reason),
  );

  transcriber.on("turn", (turn) => {
    if (!turn.transcript) return;
    ws.send(JSON.stringify({ transcript: turn.transcript }));
  });

  await transcriber.connect();

  const inputStream = new PassThrough();

  const ffmpegProcess = ffmpeg()
    .input(inputStream)
    .inputFormat("webm")
    .audioFrequency(16000)
    .audioChannels(1)
    .audioCodec("pcm_s16le")
    .format("s16le")
    .on("error", (err) => console.error("FFmpeg error:", err))
    .pipe();

  Readable.toWeb(ffmpegProcess).pipeTo(transcriber.stream());

  ws.on("message", (data) => {
    inputStream.write(data);
  });

  ws.on("close", async () => {
    inputStream.end();
    await transcriber.close();
  });
});

app.get("/", (req, res) => res.send(`server running`));

server.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`));
