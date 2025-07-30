import {
  createSessionService,
  getSessionsService,
} from "../services/sessions.service.js";

export async function createSessionController(req, res) {
  const { data, error, status } = await createSessionService(req.body);
  res.status(status).send({ data, error });
}

export async function updateSessionController(req, res) {
  const { data, error, status } = await createSessionService(req.body);
  res.status(status).send({ data, error });
}

export async function getSessionController(req, res) {
  const { data, error, status } = await getSessionsService(req.query);
  res.status(status).send({ data, error });
}
