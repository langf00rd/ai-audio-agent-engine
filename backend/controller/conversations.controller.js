import { getConversationsService } from "../services/conversations.service.js";
import { groupConversationsBySession } from "../utils/index.js";

export async function getConversationsController(req, res) {
  let response;
  const { agent_id, order_by } = req.query;
  if (agent_id) response = await getConversationsService({ agent_id });
  if (order_by === "session") {
    response.data = groupConversationsBySession(response.data || []);
  }
  res
    .status(response.status)
    .send({ data: response.data, error: response.error });
}
