import { hash, compare } from "bcrypt";
import { pool } from "../config/pg.js";
import jwt from "jsonwebtoken";

export async function signUpService(payload) {
  // console.log("signUpService_payload", payload);
  try {
    const { data } = await getUserByEmailService(payload.email);
    if (data) return { status: 400, error: "a user with email already exists" };
    const hashedPassword = await hash(payload.password, 10);
    const result = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
      [payload.email, hashedPassword],
    );
    return {
      message: "user created",
      data: result.rows[0],
      status: 200,
    };
  } catch (err) {
    console.log(err);
    return { error: err.message, status: 500 };
  }
}

export async function signInService(payload) {
  try {
    const { data, status } = await getUserByEmailService(payload.email);
    if (!data) return { error: "wrong credentials", status: 401 };
    const isMatch = await compare(payload.password, data.password);
    if (!isMatch) {
      return {
        error: "wrong credentials",
        status: 401,
      };
    }
    const token = jwt.sign({ userId: data.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    delete data.password; // remove hashed password from response
    return {
      data: {
        ...data,
        token,
      },
      status,
    };
  } catch (err) {
    return {
      error: err.message,
      status: 500,
    };
  }
}

async function getUserByEmailService(email) {
  try {
    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
      email,
    ]);
    if (result.rows.length === 0) {
      return { error: "user not found", status: 404 };
    }
    return { data: result.rows[0], status: 200 };
  } catch (error) {
    return {
      error: error.message,
      status: 500,
    };
  }
}
