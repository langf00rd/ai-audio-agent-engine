import {
  createAgentService,
  getAgentByIDService,
  getAgentsService,
  updateAgentService,
} from "../services/agent.service.js";

export async function createAgent(req, res) {
  const { data, error, status } = await createAgentService(req.body);
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
  const { data, error, status } = await getAgentsService();
  res.status(status).send({ data, error });
}

export async function getAgentByID(req, res) {
  const { data, error, status } = await getAgentByIDService(req.params.id);
  res.status(status).send({ data, error });
}
