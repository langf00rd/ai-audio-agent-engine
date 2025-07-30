import { pool } from "../config/pg.js";

export async function createBusinessService(payload) {
  const {
    user_id,
    name,
    slogan,
    industry,
    description,
    website,
    contact_info,
  } = payload;
  const query = `INSERT INTO businesses (user_id,name,slogan,industry,description,website,contact_info) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *;`;
  const values = [
    user_id,
    name,
    slogan,
    industry,
    description,
    website,
    JSON.stringify(contact_info),
  ];
  try {
    const result = await pool.query(query, values);
    return {
      data: result.rows[0],
      status: 200,
    };
  } catch (error) {
    console.error("create business", error);
    return {
      error: error.message,
      status: 500,
    };
  }
}
