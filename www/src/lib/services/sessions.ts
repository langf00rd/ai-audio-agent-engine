import { API_BASE_URL } from "../constants";
import { APIResponse, Session } from "../types";

export async function fetchAgentSessions(agentId: string) {
  const response = await fetch(`${API_BASE_URL}/sessions?agent_id=${agentId}`);
  const result = await response.json();
  if (result.error) throw new Error(result.error);
  return result as APIResponse<Session[]>;
}
