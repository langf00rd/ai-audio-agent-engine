import {
  createContactService,
  getContactsService,
} from "../services/contact.service.js";

export async function createContactController(req, res) {
  const { data, error, status } = await createContactService(req.body);
  res.status(status).send({ data, error });
}

export async function getContactController(req, res) {
  if (!req.query.business_id)
    res.status(400).send({ error: "invalid request" });
  const { data, error, status } = await getContactsService(
    req.query.business_id,
  );
  res.status(status).send({ data, error });
}
