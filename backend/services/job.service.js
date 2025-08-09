import { pool } from "../config/pg.js";

export async function createJobService(payload) {
  const {
    instruction,
    context,
    business_id,
    agent_id,
    contact_segment_id,
    type,
    status = "SCHEDULED",
    interval, // ISO 8601 duration string
    start_dt = new Date().toISOString(),
  } = payload;

  const query = `
    INSERT INTO jobs (instruction,context,business_id,agent_id,contact_segment_id,type,status,interval,start_dt,created_at,updated_at) VALUES (
      $1, $2::jsonb, $3, $4, $5, $6, $7, $8::interval, $9, NOW(), NOW()
    ) RETURNING *;
  `;

  const values = [
    instruction || null,
    JSON.stringify(context) || null,
    business_id,
    agent_id,
    contact_segment_id || null,
    type,
    status,
    interval || null,
    start_dt,
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
