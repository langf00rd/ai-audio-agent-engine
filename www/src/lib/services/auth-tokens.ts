import { API_BASE_URL, COOKIE_KEYS } from "../constants";
import { APIResponse, AuthToken } from "../types";
import { getCookie } from "../utils";

export async function fetchAuthTokens(businessId: string) {
  const response = await fetch(
    `${API_BASE_URL}/auth-tokens?business_id=${businessId}`,
    {
      headers: {
        Authorization: getCookie<string>(COOKIE_KEYS.token),
      } as HeadersInit,
    },
  );
  const result = await response.json();
  if (result.error) throw new Error(result.error);
  return result as APIResponse<AuthToken>;
}
