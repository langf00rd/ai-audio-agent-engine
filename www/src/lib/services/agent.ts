import Cookies from "js-cookie";
import { API_BASE_URL, COOKIE_KEYS } from "../constants";
import {
  Agent,
  AgentAnalyticsMetadata,
  Analytics,
  APIResponse,
} from "../types";

export async function fetchAgentById(agentId: string | number) {
  const response = await fetch(`${API_BASE_URL}/agents/${agentId}`);
  const result = await response.json();
  if (result.error) throw new Error(result.error);
  return result as APIResponse<Agent>;
}

export async function fetchAgents(query: string) {
  const response = await fetch(`${API_BASE_URL}/agents?${query}`, {
    headers: {
      Authorization: Cookies.get(COOKIE_KEYS.token),
    } as HeadersInit,
  });
  const result = await response.json();
  if (result.error) throw new Error(result.error);
  return result as APIResponse<Agent[]>;
}

export async function fetchAgentAnalytics(agentId: string | number) {
  const response = await fetch(`${API_BASE_URL}/analytics?agent_id=${agentId}`);
  const result = await response.json();
  if (result.error) throw new Error(result.error);
  return result as APIResponse<Analytics<AgentAnalyticsMetadata>[]>;
}

export async function createAgent(data: Record<string, unknown> | Agent) {
  const response = await fetch(`${API_BASE_URL}/agents`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: Cookies.get(COOKIE_KEYS.token),
    } as HeadersInit,
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (result.error) throw new Error(result.error);
  return result as APIResponse<Agent>;
}

export async function updateAgent(data: Agent) {
  const response = await fetch(`${API_BASE_URL}/agents/${data.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (result.error) throw new Error(result.error);
  return result as APIResponse<Agent>;
}
