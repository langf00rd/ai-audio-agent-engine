import { pool } from "../config/pg.js";

export async function getUserService(query) {
  try {
    const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [
      query.id,
    ]);
    if (result.rows.length === 0) {
      return { error: "user(s) not found", status: 404 };
    }
    return { data: result.rows[0] || {}, status: 200 };
  } catch (error) {
    return {
      error: error.message,
      status: 500,
    };
  }
}

export async function createUserService(payload) {
  const { email, password, first_name, last_name } = payload;

  const userExists = await checkUserWithEmailExists(email);
  if (userExists.data.id) {
    return {
      status: 400,
      error: "a user already exists",
    };
  }

  const query = `INSERT INTO users (email,password,first_name,last_name) VALUES ($1,$2,$3,$4) RETURNING *;`;
  const values = [email, password, first_name, last_name];
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

async function checkUserWithEmailExists(email) {
  try {
    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
      email,
    ]);
    return { data: result.rows[0] || {}, status: 200 };
  } catch (error) {
    return {
      error: error.message,
      status: 500,
    };
  }
}
