import { pool } from "../config/pg.js";
import { getAgentByIDService } from "./agent.service.js";

export async function trackAgentUsageService(payload) {
  try {
    const { type, userId, metadata } = payload;
    const { error, status } = await getAgentByIDService(metadata.agent_id);
    if (error) return { error, status };
    const query = `
      INSERT INTO analytics (type, user_id, metadata)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const result = await pool.query(query, [type, userId || null, metadata]);
    return { message: "data stored", data: result.rows[0], status: 200 };
  } catch (error) {
    return {
      error: error.message,
      status: 500,
    };
  }
}

export async function getAnalyticsByAgentId(agentId) {
  try {
    const { error, status } = await getAgentByIDService(agentId);
    if (error) return { error, status };
    const result = await pool.query(
      `SELECT * FROM analytics WHERE metadata->>'agent_id' = $1 ORDER BY created_at DESC`,
      [agentId],
    );
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
