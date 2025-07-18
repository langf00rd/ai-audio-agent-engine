import { hash } from "bcrypt";
import { pool } from "../config/pg.js";

export async function signUpService(payload) {
  try {
    const hashedPassword = await hash(payload.password, 10);
    const result = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
      [payload.email, hashedPassword],
    );
    return {
      data: result,
      status: 200,
    };
  } catch (err) {
    console.log(err);
    return { error: String(err), status: 500 };
  }
}
