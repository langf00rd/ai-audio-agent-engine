import { pool } from "../config/pg.js";

export async function createSessionService(payload) {
  const { id, agent_id } = payload;
  const query = `INSERT INTO sessions (id, agent_id) VALUES ($1,$2) RETURNING *;`;
  const values = [id, agent_id];
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

export async function updateSessionService(payload) {
  const { id, agent_id } = payload;
  const query = `
    UPDATE sessions
    SET agent_id = $2
    WHERE id = $1
    RETURNING *;
  `;
  const values = [id, agent_id];
  try {
    const result = await pool.query(query, values);
    if (result.rowCount === 0) {
      return {
        error: "Session not found",
        status: 404,
      };
    }
    return {
      data: result.rows[0],
      status: 200,
    };
  } catch (error) {
    console.error("update session", error);
    return {
      error: error.message,
      status: 500,
    };
  }
}

export async function getSessionsService(payload) {
  const { session_id, agent_id } = payload;
  let query, values;
  if (session_id) {
    query = `SELECT * FROM sessions WHERE id = $1 ORDER BY start_dt DESC;`;
    values = [session_id];
  }
  if (agent_id) {
    query = `SELECT * FROM sessions WHERE agent_id = $1 ORDER BY start_dt DESC;`;
    values = [agent_id];
  }
  try {
    const result = await pool.query(query, values);
    return {
      data: result.rows,
      status: 200,
    };
  } catch (error) {
    console.error("get sessions by agent_id", error);
    return {
      error: error.message,
      status: 500,
    };
  }
}
