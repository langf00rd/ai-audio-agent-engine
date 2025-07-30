import { pool } from "../config/pg.js";

export async function createAgentService(userId, payload) {
  const { name, description, custom_reactions, business_id } = payload;
  // TODO:check if business with id exists
  const query = `INSERT INTO agents (name,description,custom_reactions,business_id) VALUES ($1,$2,$3,$4) RETURNING *;`;
  const values = [name, description, custom_reactions, business_id];
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

export async function updateAgentService(agentId, payload) {
  const { name, description, custom_reactions, is_public } = payload;
  const query = `
    UPDATE agents SET
      name = $1,
      description = $2,
      custom_reactions = $3,
      is_public = $4,
      updated_at = NOW()
    WHERE id = $5
    RETURNING *;
  `;
  const values = [name, description, custom_reactions, is_public, agentId];
  try {
    const { error, status } = await getAgentByIDService(agentId);
    if (error) {
      return {
        error,
        status,
      };
    }
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

export async function getAgentsService({ businessId }) {
  try {
    const result = await pool.query(
      `SELECT * FROM agents WHERE business_id = $1`,
      [businessId],
    );
    return { data: result.rows, status: 200 };
  } catch (error) {
    return {
      error: error.message,
      status: 500,
    };
  }
}

export async function getAgentByIDService(id) {
  try {
    const result = await pool.query(`SELECT * FROM agents WHERE id = $1`, [id]);
    if (result.rows.length === 0) {
      return { error: "agent not found", status: 404 };
    }
    return { data: result.rows[0], status: 200 };
  } catch (error) {
    return {
      error: error.message,
      status: 500,
    };
  }
}
