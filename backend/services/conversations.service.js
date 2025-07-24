import { readFromSQlite } from "../config/sqlite.js";

export async function getConversationsService({ agent_id }) {
  try {
    const conversationHistory = await readFromSQlite(
      `SELECT * FROM messages WHERE agent_id = ? ORDER BY created_at ASC`,
      [agent_id],
    );
    return { data: conversationHistory, status: 200 };
  } catch (error) {
    return {
      error: error.message,
      status: 500,
    };
  }
}
