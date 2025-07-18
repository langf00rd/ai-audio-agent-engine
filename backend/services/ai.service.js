import { generateText } from "ai";
import { chatModel } from "../config/ai.js";
import { getAgentByIDService } from "./agent.service.js";

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
