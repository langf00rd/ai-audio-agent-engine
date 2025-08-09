import { generateObject } from "ai";
import { chatModel } from "../config/ai.js";
import { pool } from "../config/pg.js";
import {
  CONVERSATION_TAGGING_SYSTEM_PROMPT,
  formatMessages,
} from "../utils/prompts.js";
import { analyzeConversationSchema } from "../utils/schema.js";
import {
  getSessionsService,
  updateSessionService,
} from "./sessions.service.js";
import { getAgentByIDService } from "./agent.service.js";
import {
  addContactMethodService,
  createContactService,
} from "./contact.service.js";

export async function createConversationService(payload) {
  const { session_id, agent_id, user_input, llm_response } = payload;
  try {
    const result = await pool.query(
      `INSERT INTO conversations (session_id,agent_id,user_input,llm_response) VALUES ($1,$2,$3,$4) RETURNING *;`,
      [session_id, agent_id, user_input, llm_response],
    );
    await updateSessionService({ id: session_id, agent_id });
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
      query = `SELECT * FROM conversations WHERE session_id = $1 ORDER BY created_at ASC`;
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
    if (sessionConversations.error) return sessionConversations;
    if (sessionConversations.data.length < 1) {
      return {
        status: 404,
        error: "no conversations no analyze",
      };
    }

    // const analyzedConversations = await getAnalyzedConversationsService({
    //   session_id: sessionId,
    // });

    // if (analyzedConversations.data) {
    //   return {
    //     status: 404,
    //     error: "conversation already analyzed",
    //     data: analyzedConversations.data,
    //   };
    // }

    const { object } = await generateObject({
      model: chatModel,
      schema: analyzeConversationSchema,
      messages: [
        {
          role: "system",
          content: CONVERSATION_TAGGING_SYSTEM_PROMPT.trim(),
        },
        ...formatMessages(sessionConversations.data),
      ],
    });

    const response = await createAnalyzedConversationsService({
      ...object,
      session_id: sessionId,
    });

    if (response.error) return response;

    const {
      data: session,
      error: sessionError,
      status: sessionStatus,
    } = await getSessionsService({
      id: sessionId,
    });

    if (sessionError) {
      return {
        error: sessionError,
        status: sessionStatus,
      };
    }

    const {
      data: agent,
      error: agentError,
      status: agentStatus,
    } = await getAgentByIDService(session[0].agent_id);

    if (agentError) {
      return {
        error: agentError,
        status: agentStatus,
      };
    }

    const { phone, email, name } = response.data.customer || {};

    // try get first and last names
    let first_name = "";
    let last_name = "";
    if (name) {
      const parts = name.trim().split(/\s+/);
      if (parts.length === 1) {
        first_name = parts[0];
      } else if (parts.length === 2) {
        [first_name, last_name] = parts;
      } else {
        first_name = parts[0];
        last_name = parts.slice(1).join(" ");
      }
    }

    const business_id = agent.business_id;

    // pick primary method (first priority: email, then phone)
    let primaryType, primaryValue;
    if (email) {
      primaryType = "EMAIL";
      primaryValue = email;
    } else if (phone) {
      primaryType = "PHONE";
      primaryValue = phone;
    }

    if (primaryType) {
      const contactRes = await createContactService({
        business_id,
        first_name,
        last_name,
        type: primaryType,
        value: primaryValue,
      });

      if (contactRes.error) return contactRes;

      const contact = contactRes.data;

      // add second method if exists
      if (primaryType === "EMAIL" && phone) {
        await addContactMethodService(contact.id, "PHONE", phone);
      } else if (primaryType === "PHONE" && email) {
        await addContactMethodService(contact.id, "EMAIL", email);
      }
    }

    // if (!primaryType) {
    //   return { error: "No contact method provided", status: 400 };
    // }

    return {
      data: object,
      status: 200,
    };
  } catch (error) {
    return {
      error: error.message,
      status: 500,
    };
  }
}
