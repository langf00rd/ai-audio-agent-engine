import { API_BASE_URL } from "../constants";
import { APIResponse, Contact } from "../types";

export async function fetchContacts(businessId: string) {
  const response = await fetch(
    `${API_BASE_URL}/contacts?business_id=${businessId}`,
  );
  const result = await response.json();
  if (result.error) throw new Error(result.error);
  return result as APIResponse<Contact[]>;
}
