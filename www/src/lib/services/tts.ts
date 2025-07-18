import { API_BASE_URL } from "../constants";

export async function speak(text: string) {
  if (!text) return;
  try {
    const response = await fetch(`${API_BASE_URL}/utils/tts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (!response.ok) throw new Error("failed to fetch audio");
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.play();
  } catch (err) {
    throw err;
  }
}
