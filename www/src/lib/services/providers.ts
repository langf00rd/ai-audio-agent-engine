import Cookies from "js-cookie";
import { API_BASE_URL, COOKIE_KEYS } from "../constants";
import { APIResponse } from "../types";

export async function fetchGoogleProviderOauthURL() {
  const response = await fetch(
    `${API_BASE_URL}/providers/auth/google?action=MAIL`,
  );
  const result = await response.json();
  if (result.error) throw new Error(result.error);
  return result as APIResponse<string>;
}

export async function fetchGoogleProviderOauthCredentials(
  code: string,
  businessId: string,
) {
  const response = await fetch(
    `${API_BASE_URL}/providers/auth/google/tokens?code=${code}&businessId=${businessId}`,
    {
      headers: {
        Authorization: Cookies.get(COOKIE_KEYS.token),
      } as HeadersInit,
    },
  );
  const result = await response.json();
  if (result.error) throw new Error(result.error);
  return result as APIResponse<{ access_token: string; refresh_token: string }>;
}
