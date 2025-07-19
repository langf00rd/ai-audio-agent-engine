import { ttsService } from "../services/tts.service.js";

export async function ttsController(req, res) {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "text is required" });
  await ttsService(text, res);
}
