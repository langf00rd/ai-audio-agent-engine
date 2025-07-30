import { compare, hash } from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../config/pg.js";
import { getBusinessesService } from "./business.service.js";

export async function signUpService(payload) {
  try {
    const { data } = await getUserByEmail(payload.email);
    if (data) return { status: 400, error: "a user already exists" };
    const hashedPassword = await hash(payload.password, 10);
    const result = await pool.query(
      "INSERT INTO users (email,password,first_name,last_name) VALUES ($1, $2, $3, $4) RETURNING id, email, first_name, last_name, created_at",
      [payload.email, hashedPassword, payload.first_name, payload.last_name],
    );
    return {
      message: "user created",
      data: result.rows[0],
      status: 200,
    };
  } catch (err) {
    return { error: err.message, status: 500 };
  }
}

export async function signInService(payload) {
  try {
    const { data, status } = await getUserByEmail(payload.email);
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

    const businesses = await getBusinessesService({ user_id: data.id });

    if (businesses.error) return businesses;

    return {
      data: {
        ...data,
        token,
        businesses: businesses.data,
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

async function getUserByEmail(email) {
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
