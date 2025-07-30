import { createSessionService } from "../services/sessions.service.js";

export async function createSessionController(req, res) {
  const { data, error, status } = await createSessionService(req.body);
  res.status(status).send({ data, error });
}
