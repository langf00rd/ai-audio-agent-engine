import { API_BASE_URL } from "../constants";
import { APIResponse } from "../types";

export async function fetchAIResponse(
  transcript: string,
  agentId: string,
  sessionId: string,
) {
  const response = await fetch(`${API_BASE_URL}/ai`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt: transcript,
      agent: agentId,
      session_id: sessionId,
    }),
  });
  const result = await response.json();
  if (result.error) throw new Error(result.error);
  return result as APIResponse<string>;
}
