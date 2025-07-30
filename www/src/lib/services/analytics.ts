import { API_BASE_URL } from "../constants";
import { AgentAnalyticsMetadata, Analytics, APIResponse, User } from "../types";

export async function trackAgentUsage(agentId: string, sessionId: string) {
  const response = await fetch(`${API_BASE_URL}/analytics`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "AGENT_USAGE",
      metadata: {
        agent_id: agentId,
        session_id: sessionId,
      },
    }),
  });
  const result = await response.json();
  if (result.error) throw new Error(result.error);
  return result as APIResponse<User>;
}

export async function fetchAgentAnalytics(agentId: string | number) {
  const response = await fetch(`${API_BASE_URL}/analytics?agent_id=${agentId}`);
  const result = await response.json();
  if (result.error) throw new Error(result.error);
  return result as APIResponse<Analytics<AgentAnalyticsMetadata>[]>;
}
