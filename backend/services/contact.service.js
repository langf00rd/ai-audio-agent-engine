import { pool } from "../config/pg.js";

export async function createContactService(payload) {
  const client = await pool.connect();
  const { business_id, first_name, last_name, type, value, notes } = payload;
  try {
    await client.query("BEGIN");
    const contactQuery = `
        INSERT INTO contacts (business_id, first_name, last_name, notes)
        VALUES ($1, $2, $3, $4)
        RETURNING id, business_id, first_name, last_name, notes, created_at;
      `;
    const contactValues = [
      business_id,
      first_name,
      last_name || null,
      notes || null,
    ];
    const contactResult = await client.query(contactQuery, contactValues);
    const contact = contactResult.rows[0];
    const methodQuery = `
        INSERT INTO contact_methods (contact_id, type, value)
        VALUES ($1, $2, $3)
        RETURNING id, contact_id, type, value, created_at;
      `;
    const methodValues = [contact.id, type, value];
    const methodResult = await client.query(methodQuery, methodValues);
    const contactMethod = methodResult.rows[0];
    await client.query("COMMIT");
    return {
      data: { ...contact, methods: [contactMethod] },
      status: 201,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    return {
      error: error.message,
      status: 500,
    };
  } finally {
    client.release();
  }
}

export async function getContactsService(businessId) {
  try {
    const query = `
    SELECT
        c.id AS id,
        c.business_id,
        c.first_name,
        c.last_name,
        c.notes,
        c.created_at,
        c.updated_at,
        COALESCE(
            json_agg(
                json_build_object(
                    'id', cm.id,
                    'type', cm.type,
                    'value', cm.value,
                    'created_at', cm.created_at,
                    'updated_at', cm.updated_at
                )
            ) FILTER (WHERE cm.id IS NOT NULL),
            '[]'
        ) AS contact_methods
    FROM contacts c
    LEFT JOIN contact_methods cm ON c.id = cm.contact_id
    WHERE c.business_id = $1
    GROUP BY c.id
    ORDER BY c.created_at DESC;
  `;
    const values = [businessId];
    const result = await pool.query(query, values);
    return {
      data: result.rows,
      status: 200,
    };
  } catch (err) {
    return { error: err.message, status: 500 };
  }
}

export async function addContactMethodService(contact_id, type, value) {
  try {
    const methodQuery = `
      INSERT INTO contact_methods (contact_id, type, value)
      VALUES ($1, $2, $3)
      RETURNING id, contact_id, type, value, created_at;
    `;
    const methodResult = await pool.query(methodQuery, [
      contact_id,
      type,
      value,
    ]);
    return { data: methodResult.rows[0], status: 201 };
  } catch (error) {
    return { error: error.message, status: 500 };
  }
}
