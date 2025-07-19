import { AssemblyAI } from "assemblyai";
import ffmpegStatic from "ffmpeg-static";
import ffmpeg from "fluent-ffmpeg";
import { PassThrough, Readable } from "stream";

const ffmpegPath = ffmpegStatic || "/opt/homebrew/bin/ffmpeg";

ffmpeg.setFfmpegPath(ffmpegPath);

export async function handleWebSocketConnection(ws) {
  const client = new AssemblyAI({ apiKey: process.env.ASSEMBLY_AI_API_KEY });

  const transcriber = client.streaming.transcriber({
    sampleRate: 16_000,
    formatTurns: true,
  });

  transcriber.on("open", ({ id }) => {
    console.log(`session opened -> ${id}`);
    ws.send(JSON.stringify({ sessionId: id }));
  });

  transcriber.on("error", (error) => {
    console.error("transcriber error:", error);
  });

  transcriber.on("close", (code, reason) =>
    console.log("transcriber session closed -> ", code, reason),
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
    .on("error", (err) => console.error("ffmpeg error:", err))
    .pipe();

  Readable.toWeb(ffmpegProcess).pipeTo(transcriber.stream());

  ws.on("message", (data) => {
    inputStream.write(data);
  });

  ws.on("close", async () => {
    inputStream.end();
    await transcriber.close();
  });
}
