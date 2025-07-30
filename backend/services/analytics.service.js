import { pool } from "../config/pg.js";
import { getAgentByIDService } from "./agent.service.js";

export async function trackAgentUsageService(payload) {
  try {
    const { metadata } = payload;
    const { error, status } = await getAgentByIDService(metadata.agent_id);
    if (error) return { error, status };
    const query = `
      INSERT INTO analytics (event_type, metadata)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const result = await pool.query(query, ["AGENT_USAGE", metadata]);
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
