import { generateText } from "ai";
import { chatModel } from "../config/ai.js";
import { pool } from "../config/pg.js";
import { CONVERSATION_TAGGING_SYSTEM_PROMPT } from "../utils/prompts.js";

export async function createConversationService(payload) {
  const { session_id, agent_id, user_input, llm_response } = payload;
  try {
    const result = await pool.query(
      `INSERT INTO conversations ( session_id,agent_id,user_input,llm_response) VALUES ($1,$2,$3,$4) RETURNING *;`,
      [session_id, agent_id, user_input, llm_response],
    );
    return { data: result.rows[0], status: 200 };
  } catch (err) {
    return { error: err.message, status: 500 };
  }
}

export async function getConversationsService(queryParams) {
  const { session_id } = queryParams;
  try {
    let query, values;
    if (session_id) {
      query = `SELECT * FROM conversations WHERE session_id = $1 ORDER BY created_at DESC`;
      values = [session_id];
    } else {
      query = `SELECT * FROM conversations ORDER BY created_at ASC`;
      values = [];
    }
    const result = await pool.query(query, values);
    return {
      data: result.rows,
      status: 200,
    };
  } catch (error) {
    console.error("get conversations", error);
    return {
      error: error.message,
      status: 500,
    };
  }
}

export async function getAnalyzedConversationsService(payload) {
  try {
    const result = await pool.query(
      `SELECT * FROM analyzed_conversations WHERE session_id = $1 ORDER BY created_at DESC`,
      [payload.session_id],
    );
    if (result.rows.length < 1) {
      return {
        status: 404,
        error: "conversation not analyzed",
      };
    }
    return {
      data: result.rows[0] || {},
      status: 200,
    };
  } catch (error) {
    return {
      error: error.message,
      status: 500,
    };
  }
}

export async function createAnalyzedConversationsService(payload) {
  const {
    session_id,
    summary,
    intent,
    lead_quality,
    next_step,
    confidence,
    metadata = {},
    customer = {},
  } = payload;
  const query = `
    INSERT INTO analyzed_conversations (session_id, summary, intent, lead_quality,next_step, confidence, metadata, customer) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *;
  `;
  const values = [
    session_id,
    summary,
    intent,
    lead_quality,
    next_step,
    confidence,
    metadata,
    customer,
  ];
  try {
    const result = await pool.query(query, values);
    return {
      data: result.rows[0],
      status: 200,
    };
  } catch (error) {
    console.error("create analyzed conversation", error);
    return {
      error: error.message,
      status: 500,
    };
  }
}

export async function analyzeConversationsService(sessionId) {
  try {
    const sessionConversations = await getConversationsService({
      session_id: sessionId,
    });

    if (sessionConversations.data.length < 1) {
      return {
        status: 404,
        error: "no conversations no analyze",
      };
    }

    const analyzedConversations = await getAnalyzedConversationsService({
      session_id: sessionId,
    });

    if (analyzedConversations.data.length > 1) {
      return {
        status: 404,
        error: "conversation already analyzed",
      };
    }

    const formattedConversationHistory = sessionConversations.data.map((a) => {
      return {
        user: a.user_input,
        llm: a.llm_response,
        created_at: a.created_at,
      };
    });

    const result = await generateText({
      model: chatModel,
      system: CONVERSATION_TAGGING_SYSTEM_PROMPT,
      prompt: `conversations: ${JSON.stringify(formattedConversationHistory)}`,
    });

    const parsedResult = JSON.parse(result.text);

    console.log("result", parsedResult);

    const response = await createAnalyzedConversationsService({
      ...parsedResult,
      session_id: sessionId,
    });

    if (response.error) return response;

    return {
      message: "conversation analyzed",
      data: parsedResult,
      status: 200,
    };
  } catch (error) {
    console.error("get conversations", error);
    return {
      error: error.message,
      status: 500,
    };
  }
}
