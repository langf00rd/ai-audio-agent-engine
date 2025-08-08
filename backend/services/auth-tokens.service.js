import { pool } from "../config/pg.js";
import { decrypt } from "../utils/security.js";

export async function createAuthTokenService(payload) {
  const {
    user_id,
    access_token,
    refresh_token,
    provider,
    expires_at,
    business_id,
  } = payload;
  const query = `INSERT INTO auth_tokens (user_id,access_token,refresh_token,provider,expires_at,business_id) VALUES ($1,$2,$3,$4,$5,$6);`;
  const values = [
    user_id,
    access_token,
    refresh_token,
    provider,
    expires_at,
    business_id,
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
    const _data = result.rows[0];

    if (!_data) {
      return { status: 404, error: "no tokens found" };
    }

    return {
      data: {
        ..._data,
        access_token: decrypt(_data.access_token),
        refresh_token: decrypt(_data.refresh_token),
      },
      status: 200,
    };
  } catch (error) {
    return {
      error: error.message,
      status: 500,
    };
  }
}
