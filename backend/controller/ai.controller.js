import { aiChatService } from "../services/ai.service.js";

export async function aiChat(req, res) {
  const { data, error, status } = await aiChatService(req.body);
  res.status(status).send({ data, error });
}
