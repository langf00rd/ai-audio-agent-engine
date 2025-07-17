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
      YOU ARE A SALES AGENT
      YOUR ROLE INFORMATION: ${JSON.stringify(agent)}
      BE BRIEF AND CONCISE AND CASUAL FRIENDLY
      DO NOT TALK ABOUT THINGS YOU DO NOT HAVE KNOWLEDGE OF. IN SUCH CASES, TELL THE USER TO CONTACT CUSTOMER CARE
      NOW RESPOND TO THIS: ${payload.prompt}
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
