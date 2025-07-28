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
