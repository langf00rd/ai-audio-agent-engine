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

export async function addContactsToSegmentService(segmentId, contactIds) {
  const values = contactIds.map((_, i) => `($1, $${i + 2})`).join(", ");
  const params = [segmentId, ...contactIds];
  const query = `
    INSERT INTO contact_segment_members (contact_segment_id, contact_id)
    VALUES ${values}
    ON CONFLICT (contact_segment_id, contact_id) DO NOTHING
    RETURNING *;
  `;
  try {
    const result = await pool.query(query, params);
    return {
      data: result.rows,
      status: 200,
    };
  } catch (error) {
    return {
      error: error.message,
      status: 500,
    };
  }
}

export async function createContactSegmentService(payload) {
  const { business_id, name } = payload;
  const query = `INSERT INTO contact_segments (business_id,name,created_at,updated_at) VALUES ($1, $2, NOW(), NOW()) RETURNING *;`;
  const values = [business_id, name];
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

export async function getContactSegmentService(payload) {
  try {
    const { id, business_id } = payload;
    let segmentQuery;
    let segmentParams;
    if (id) {
      segmentQuery = `SELECT * FROM contact_segments WHERE id = $1;`;
      segmentParams = [id];
    } else if (business_id) {
      segmentQuery = `SELECT * FROM contact_segments WHERE business_id = $1;`;
      segmentParams = [business_id];
    } else {
      return { error: "Must provide either id or business_id", status: 400 };
    }
    const segmentResult = await pool.query(segmentQuery, segmentParams);
    if (segmentResult.rows.length === 0) {
      return { error: "contact segment(s) not found", status: 404 };
    }
    if (id) {
      const segment = segmentResult.rows[0];
      const contactsQuery = `
        SELECT c.*
        FROM contacts c
        JOIN contact_segment_members csm ON c.id = csm.contact_id
        WHERE csm.contact_segment_id = $1;
      `;
      const contactsResult = await pool.query(contactsQuery, [id]);
      const contacts = contactsResult.rows;
      if (contacts.length === 0) {
        return {
          data: { ...segment, contacts: [] },
          status: 200,
        };
      }
      const contactIds = contacts.map((c) => c.id);
      const methodsQuery = `
        SELECT *
        FROM contact_methods
        WHERE contact_id = ANY($1)
        ORDER BY contact_id;
      `;
      const methodsResult = await pool.query(methodsQuery, [contactIds]);
      const methodsByContact = {};
      methodsResult.rows.forEach((method) => {
        if (!methodsByContact[method.contact_id]) {
          methodsByContact[method.contact_id] = [];
        }
        methodsByContact[method.contact_id].push(method);
      });
      const contactsWithMethods = contacts.map((contact) => ({
        ...contact,
        contact_methods: methodsByContact[contact.id] || [],
      }));
      return {
        data: { ...segment, contacts: contactsWithMethods },
        status: 200,
      };
    }
    return {
      data: segmentResult.rows,
      status: 200,
    };
  } catch (error) {
    return {
      error: error.message,
      status: 500,
    };
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
