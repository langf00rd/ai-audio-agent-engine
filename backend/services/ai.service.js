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
      YOUR ROLE INFORMATION: ${JSON.stringify(agent)}
      WITH THAT IN MIND, RESPOND TO THIS: ${payload.prompt}
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
