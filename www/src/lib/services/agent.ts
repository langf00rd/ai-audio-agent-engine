import { API_BASE_URL } from "../constants";
import { Agent, APIResponse } from "../types";

export async function fetchAgentById(agentId: string | number) {
  const response = await fetch(`${API_BASE_URL}/agents/${agentId}`);
  if (!response.ok) throw new Error("an error occurred. try again later.");
  const result = await response.json();
  if (result.error) throw new Error(result.error);
  return result as APIResponse<Agent>;
}
