import { API_BASE_URL } from "../constants";
import { APIResponse, Business } from "../types";

export async function createBusiness(payload: Record<string, unknown>) {
  const response = await fetch(`${API_BASE_URL}/businesses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const result = await response.json();
  if (result.error) throw new Error(result.error);
  return result as APIResponse<Business>;
}

export async function updateBusiness(payload: Business) {
  const response = await fetch(`${API_BASE_URL}/businesses/${payload.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const result = await response.json();
  if (result.error) throw new Error(result.error);
  return result as APIResponse<Business>;
}
