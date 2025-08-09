import {
  addContactMethodService,
  addContactsToSegmentService,
  createContactSegmentService,
  createContactService,
  getContactMethodService,
  getContactSegmentService,
  getContactsService,
} from "../services/contact.service.js";

export async function createContactController(req, res) {
  const { data, error, status } = await createContactService(req.body);
  res.status(status).send({ data, error });
}

export async function createContactSegmentController(req, res) {
  const { data, error, status } = await createContactSegmentService(req.body);
  res.status(status).send({ data, error });
}

export async function getContactSegmentController(req, res) {
  const { data, error, status } = await getContactSegmentService(req.query);
  res.status(status).send({ data, error });
}

export async function getContactMethodController(req, res) {
  const { data, error, status } = await getContactMethodService(req.query);
  res.status(status).send({ data, error });
}

export async function addContactsToSegmentController(req, res) {
  const { data, error, status } = await addContactsToSegmentService(
    req.body.contact_segment_id,
    req.body.contact_id,
  );
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
