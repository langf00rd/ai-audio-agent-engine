import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  createAgentService,
  getAgentByIDService,
  getAgentsService,
  updateAgentService,
} from "../services/agent.service.js";
import { decodeJWT } from "../utils/auth.js";

export async function createAgentController(req, res) {
  const authToken = req.headers.authorization;
  if (!authToken) res.status(401).send({ error: "unauthorized" });
  const userId = decodeJWT(authToken).userId;
  if (!userId) res.status(401).send({ error: "unauthorized" });
  const { data, error, status } = await createAgentService(userId, req.body);
  res.status(status).send({ data, error });
}

export async function updateAgent(req, res) {
  const { data, error, status } = await updateAgentService(
    req.params.id,
    req.body,
  );
  res.status(status).send({ data, error });
}

export async function getAgents(req, res) {
  const { data, error, status } = await getAgentsService({
    businessId: req.query.business_id,
  });
  res.status(status).send({ data, error });
}

export async function getAgentById(req, res) {
  const { data, error, status } = await getAgentByIDService(req.params.id);
  res.status(status).send({ data, error });
}
