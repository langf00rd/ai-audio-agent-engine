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
    return {
      error: error.message,
      status: 500,
    };
  }
}

export async function updateBusinessService(business_id, payload) {
  const { name, slogan, industry, description, website, contact_info } =
    payload;

  const query = `
    UPDATE businesses
    SET
      name = $1,
      slogan = $2,
      industry = $3,
      description = $4,
      website = $5,
      contact_info = $6
    WHERE id = $7
    RETURNING *;
  `;
  const values = [
    name,
    slogan,
    industry,
    description,
    website,
    JSON.stringify(contact_info),
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

export async function getBusinessesService(payload) {
  try {
    const { user_id, id } = payload;
    let query, values;
    if (user_id) {
      query = `SELECT * FROM businesses WHERE user_id = $1`;
      values = [user_id];
    }
    if (id) {
      query = `SELECT * FROM businesses WHERE id = $1`;
      values = [id];
    }
    const result = await pool.query(query, values);
    return { data: result.rows, status: 200 };
  } catch (err) {
    return {
      error: err.message,
      status: 500,
    };
  }
}
