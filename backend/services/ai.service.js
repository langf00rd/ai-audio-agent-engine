import { generateText } from "ai";
import { chatModel } from "../config/ai.js";
import { generateSystemPrompt } from "../utils/ai.js";
import { getAgentByIDService } from "./agent.service.js";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

export async function aiChatService(payload) {
  try {
    const {
      data: agent,
      error,
      status,
    } = await getAgentByIDService(payload.agent);
    if (error) return { error, status };
    const prompt = `
      You're a friendly, casual sales agent. Here's your product info: ${JSON.stringify(agent)}.
      Keep replies short, natural, and human — no robotic tone.
      If a question isn’t covered in the info, politely suggest they contact support.
      No emojis. Do not start with Heys or His. Just talk
      Now answer this: ${payload.prompt}
    `;
    const { text } = await generateText({
      model: chatModel,
      prompt,
    });
    return { data: text, status: 200 };
  } catch (error) {
    return {
      error: error.message,
      status: 500,
    };
  }
}

export async function taggingService(payload) {
  try {
    const ollamaRes = await fetch(`${process.env.DOMAIN_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "tinyllama:chat",
        prompt: generateSystemPrompt(payload.prompt, "TAGGING"),
        stream: false,
      }),
    });
    console.log(generateSystemPrompt(payload.prompt, "TAGGING"));
    const { data, error } = await ollamaRes.json();
    if (error) throw new Error(error);
    return { data, status: 200 };
  } catch (err) {
    return { status: 500, error: err.message };
  }
}
