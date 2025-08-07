import { pool } from "../config/pg.js";

export async function createAuthTokenService(payload) {
  const { user_id, access_token, refresh_token, provider, expires_at } =
    payload;
  const query = `INSERT INTO auth_tokens (user_id,access_token,refresh_token,provider,expires_at) VALUES ($1,$2,$3,$4,$5);`;
  const values = [user_id, access_token, refresh_token, provider, expires_at];
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

export async function getAuthTokenService(queryObj) {
  try {
    let whereClauses = [];
    let values = [];
    let idx = 1;
    for (const [key, value] of Object.entries(queryObj)) {
      whereClauses.push(`${key} = $${idx}`);
      values.push(value);
      idx++;
    }
    let query = `SELECT * FROM auth_tokens`;
    if (whereClauses.length > 0) {
      query += ` WHERE ${whereClauses.join(" AND ")}`;
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
