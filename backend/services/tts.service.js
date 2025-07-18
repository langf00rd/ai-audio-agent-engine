import { SynthesizeSpeechCommand } from "@aws-sdk/client-polly";
import { polly } from "../config/tts.js";

export async function ttsService(text, res) {
  try {
    const command = new SynthesizeSpeechCommand({
      OutputFormat: "mp3",
      Text: text,
      VoiceId: "Matthew",
      Engine: "neural",
    });
    const { AudioStream } = await polly.send(command);
    if (AudioStream) {
      res.set({
        "Content-Type": "audio/mpeg",
        "Content-Disposition": "inline",
      });
      AudioStream.pipe(res);
    } else res.status(404).json({ error: "no audio stream" });
  } catch (err) {
    console.error("polly error:", err);
    res.status(500).json({ error: err.message });
  }
}
