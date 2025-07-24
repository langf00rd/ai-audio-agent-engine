import { API_BASE_URL } from "../constants";
import {
  AgentAnalyticsMetadata,
  AgentConfig,
  Analytics,
  APIResponse,
} from "../types";

export async function fetchAgentById(agentId: string | number) {
  const response = await fetch(`${API_BASE_URL}/agents/${agentId}`);
  const result = await response.json();
  if (result.error) throw new Error(result.error);
  return result as APIResponse<AgentConfig>;
}

export async function fetchAgentAnalytics(agentId: string | number) {
  const response = await fetch(`${API_BASE_URL}/analytics?agent_id=${agentId}`);
  const result = await response.json();
  if (result.error) throw new Error(result.error);
  return result as APIResponse<Analytics<AgentAnalyticsMetadata>[]>;
}

export async function createAgent(data: AgentConfig) {
  const response = await fetch(`${API_BASE_URL}/agents`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...data, is_public: false }),
  });
  const result = await response.json();
  if (result.error) throw new Error(result.error);
  return result as APIResponse<AgentConfig>;
}

export async function updateAgent(data: AgentConfig) {
  const response = await fetch(`${API_BASE_URL}/agents/${data.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (result.error) throw new Error(result.error);
  return result as APIResponse<AgentConfig>;
}
