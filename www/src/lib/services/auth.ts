import { API_BASE_URL } from "../constants";
import { Agent, APIResponse } from "../types";

export async function signUp(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/auth/sign-up`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  const result = await response.json();
  if (result.error) throw new Error(result.error);
  return result as APIResponse<Agent>;
}

export async function signIn(email: string, password: string) {}
