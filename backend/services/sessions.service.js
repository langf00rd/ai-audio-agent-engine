import { pool } from "../config/pg.js";

export async function createSessionService(payload) {
  const { agentId, sessionId } = payload;
  const query = `INSERT INTO sessions (session_id, agent_id) VALUES ($1,$2) RETURNING *;`;
  const values = [sessionId, agentId];
  try {
    const result = await pool.query(query, values);
    return {
      data: result.rows[0],
      status: 200,
    };
  } catch (error) {
    console.error("create session", error);
    return {
      error: error.message,
      status: 500,
    };
  }
}
