import { generateText } from "ai";
import { chatModel } from "../config/ai.js";
import {
  generateSystemPrompt,
  parseConversationSessionHistory,
} from "../utils/ai.js";
import { getAgentByIDService } from "./agent.service.js";
import { insertIntoSQlite, readFromSQlite } from "../config/sqlite.js";

export async function aiChatService(payload) {
  try {
    const conversationHistory = await readFromSQlite(
      `SELECT * FROM messages WHERE session_id = ? ORDER BY created_at ASC`,
      [payload.session_id],
    );
    const parsedConversationHistory = parseConversationSessionHistory(
      conversationHistory.slice(-3),
    );
    console.log("parsedConversationHistory", parsedConversationHistory);
    const {
      data: agent,
      error,
      status,
    } = await getAgentByIDService(payload.agent);

    if (error) return { error, status };

    const prompt = generateSystemPrompt(
      payload.prompt,
      "REGULAR-CONVERSATION",
      {
        agentInfo: agent,
        history: parsedConversationHistory,
      },
    );
    const { text } = await generateText({
      model: chatModel,
      prompt,
    });
    /**
     * save the message as history into db
     * it is intentionally not marked `async`, that way it is called and executed in the background whiles other processes run
     */
    insertIntoSQlite(
      `INSERT INTO messages (session_id, agent_id, user, llm) VALUES (?, ?, ?, ?)`,
      [payload.session_id, payload.agent, payload.prompt, text],
    );
    return { data: text, status: 200 };
    // TODO: let response come with speech. frontend currently calls a separate endpoint for speech
  } catch (error) {
    console.log("error", error);
    return {
      error: error.message || error,
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
