import { API_BASE_URL } from "../constants";
import { APIResponse, SessionConversation } from "../types";

export async function fetchAgentSessionConversations(agentId: string | number) {
  const response = await fetch(
    `${API_BASE_URL}/conversations?agent_id=${agentId}&order_by=session`,
  );
  const result = await response.json();
  if (result.error) throw new Error(result.error);
  return result as APIResponse<SessionConversation[]>;
}
