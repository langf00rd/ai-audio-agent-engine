import { generateText } from "ai";
import { chatModel } from "../config/ai.js";
import { insertIntoSQlite, readFromSQlite } from "../config/sqlite.js";
import {
  generateSystemPrompt,
  parseConversationSessionHistory,
} from "../utils/ai.js";
import { getAgentByIDService } from "./agent.service.js";
import { pool } from "../config/pg.js";
import { CONVERSATION_TAGGING_SYSTEM_PROMPT } from "../utils/prompts.js";

export async function getConversationHistory(sessionId) {
  try {
    const result = await pool.query(
      `SELECT * FROM conversation_history WHERE session_id = $1 ORDER BY created_at ASC`,
      [sessionId],
    );
    const mergedMessages = result.rows.flatMap((row) => row.messages || []);
    return mergedMessages;
  } catch (err) {
    console.error("Error fetching conversation history:", err);
    throw err;
  }
}

export async function createConversationHistory(
  sessionId,
  agentId,
  prompt,
  llmResponse,
) {
  console.log("createConversationHistory", {
    sessionId,
    agentId,
    prompt,
    llmResponse,
  });
  try {
    const messages = JSON.stringify([{ user: prompt, llm: llmResponse }]);
    await pool.query(
      `INSERT INTO conversation_history (session_id,agent_id,user_input,llm_response) VALUES ($1,$2,$3,$4)`,
      [sessionId, agentId, prompt, llmResponse],
    );
  } catch (err) {
    console.error("Failed to insert conversation history:", err);
    throw err;
  }
}

export async function aiChatService(payload) {
  try {
    const conversationHistory = await readFromSQlite(
      `SELECT * FROM messages WHERE session_id = ? ORDER BY created_at ASC`,
      [payload.session_id],
    );
    const parsedConversationHistory = parseConversationSessionHistory(
      conversationHistory.slice(-3),
    );
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

export async function taggingService(sessionId) {
  try {
    const conversationHistory = await readFromSQlite(
      `SELECT * FROM messages WHERE session_id = ? ORDER BY created_at ASC`,
      [sessionId],
    );

    if (conversationHistory.length < 1) {
      return {
        status: 404,
        error: "no conversations found for this session id",
      };
    }

    // check if a conversation is already tagged by llm. if tagged, do not retag
    const checkTaggedConversationExists = `
          SELECT EXISTS (
            SELECT 1 FROM public.tagged_conversations WHERE session_id = $1
          );
        `;

    const checkTaggedConversationExistsResponse = await pool.query(
      checkTaggedConversationExists,
      [sessionId],
    );

    if (checkTaggedConversationExistsResponse.rows[0].exists) {
      return {
        status: 400,
        error: "conversation is already tagged",
      };
    }

    const formattedConversationHistory = conversationHistory.map((a) => {
      return {
        user: a.user,
        llm: a.llm,
        created_at: a.created_at,
      };
    });

    const prompt = generateSystemPrompt(
      formattedConversationHistory,
      "TAGGING",
    );

    // TODO: use locally trained llm to handle tagging
    // const { text } = await generateText({
    //   model: chatModel,
    //   prompt,
    // });

    const { text } = await generateText({
      model: chatModel,
      system: CONVERSATION_TAGGING_SYSTEM_PROMPT,
      prompt: `conversation history: ${JSON.stringify(formattedConversationHistory)}`,
    });

    const taggingResult = JSON.parse(text);

    const query = `
          INSERT INTO public.tagged_conversations (
            session_id, user_info, intent, summary, lead_quality, next_step, confidence
          ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
        `;

    const result = await pool.query(query, [
      sessionId,
      taggingResult.user_info,
      taggingResult.intent,
      taggingResult.summary,
      taggingResult.lead_quality,
      taggingResult.next_step,
      Number(taggingResult.confidence),
    ]);

    return { data: result.rows[0], status: 200 };
  } catch (err) {
    console.log(err);
    return { status: 500, error: err.message };
  }
}

export async function getTaggedConversationService(sessionId) {
  try {
    const query = `SELECT * FROM tagged_conversations WHERE session_id = $1`;
    const taggedConversationResponse = await pool.query(query, [sessionId]);
    if (taggedConversationResponse.rows.length === 0) {
      return {
        status: 404,
        error: "conversation has not been tagged",
      };
    }
    return {
      status: 200,
      data: taggedConversationResponse.rows[0] || {},
    };
  } catch (err) {
    return { status: 500, error: err.message };
  }
}
