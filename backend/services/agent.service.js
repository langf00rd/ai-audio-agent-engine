import { pool } from "../config/pg.js";

export async function createAgentService(userId, payload) {
  const {
    name,
    description,
    business_name,
    business_slogan,
    brand_voice,
    support_contact,
    custom_interactions,
    service,
    faqs,
    other_info,
    is_public,
  } = payload;
  const query = `INSERT INTO agents (name, description, business_name, business_slogan, brand_voice, support_contact, custom_interactions, service, faqs, other_info, is_public, user_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    RETURNING *;
  `;
  const values = [
    name,
    description,
    business_name,
    business_slogan,
    brand_voice,
    JSON.stringify(support_contact),
    JSON.stringify(custom_interactions),
    JSON.stringify(service),
    JSON.stringify(faqs),
    other_info,
    is_public,
    userId,
  ];
  try {
    const result = await pool.query(query, values);
    return {
      data: result.rows[0],
      status: 200,
    };
  } catch (error) {
    console.error("create agent", error);
    return {
      error,
      status: 500,
    };
  }
}

export async function updateAgentService(agentId, payload) {
  const {
    name,
    description,
    business_name,
    business_slogan,
    brand_voice,
    support_contact,
    custom_interactions,
    service,
    faqs,
    other_info,
    is_public,
  } = payload;
  const query = `
    UPDATE agents SET
      name = $1,
      description = $2,
      business_name = $3,
      business_slogan = $4,
      brand_voice = $5,
      support_contact = $6,
      custom_interactions = $7,
      service = $8,
      faqs = $9,
      other_info = $10,
      updated_at = NOW(),
      is_public = $12
    WHERE id = $11
    RETURNING *;
  `;
  const values = [
    name,
    description,
    business_name,
    business_slogan,
    brand_voice,
    JSON.stringify(support_contact),
    JSON.stringify(custom_interactions),
    JSON.stringify(service),
    JSON.stringify(faqs),
    other_info,
    agentId,
    is_public,
  ];
  try {
    const { error, status } = await getAgentByIDService(agentId);
    if (error) {
      return {
        error,
        status,
      };
    }
    const result = await pool.query(query, values);
    return {
      data: result.rows[0],
      status: 200,
    };
  } catch (error) {
    console.log(error);
    return {
      error,
      status: 500,
    };
  }
}

export async function getAgentsService({ userId }) {
  try {
    const result = await pool.query(`SELECT * FROM agents WHERE user_id = $1`, [
      userId,
    ]);
    return { data: result.rows, status: 200 };
  } catch (error) {
    console.error(`Error fetching agents for user ${userId}:`, error);
    return {
      error: error.message,
      status: 500,
    };
  }
}

export async function getAgentByIDService(id) {
  try {
    const result = await pool.query(`SELECT * FROM agents WHERE id = $1`, [id]);
    if (result.rows.length === 0) {
      return { error: "agent not found", status: 404 };
    }
    return { data: result.rows[0], status: 200 };
  } catch (error) {
    return {
      error: error.message,
      status: 500,
    };
  }
}
