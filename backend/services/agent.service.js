import { pool } from "../config/pg.js";

export async function createAgentService(payload) {
  const {
    name,
    description,
    audience,
    intro_script,
    objections_and_responses,
  } = payload;

  const query = `
    INSERT INTO agents (name,audience,intro_script,description,objections_and_responses)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
   `;

  const values = [
    name,
    JSON.stringify(audience),
    intro_script,
    description,
    JSON.stringify(objections_and_responses),
  ];

  try {
    const result = await pool.query(query, values);
    console.log("created agent:", result.rows[0]);
    return {
      data: result.rows[0],
      status: 200,
    };
  } catch (error) {
    return {
      error,
      status: 500,
    };
  }
}

export async function getAgentsService() {
  try {
    const result = await pool.query(`SELECT * FROM agents`);
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
