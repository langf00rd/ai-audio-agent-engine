import { API_BASE_URL } from "../constants";
import { APIResponse, Contact, ContactSegment } from "../types";

export async function fetchContacts(businessId: string) {
  const response = await fetch(
    `${API_BASE_URL}/contacts?business_id=${businessId}`,
  );
  const result = await response.json();
  if (result.error) throw new Error(result.error);
  return result as APIResponse<Contact[]>;
}

export async function fetchContactMethod(value: string) {
  const response = await fetch(
    `${API_BASE_URL}/contacts/methods?value=${value}`,
  );
  const result = await response.json();
  if (result.error) throw new Error(result.error);
  return result as APIResponse<Contact>;
}

export async function createContactSegment(businessId: string, name: string) {
  const response = await fetch(`${API_BASE_URL}/contacts/segments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: name,
      business_id: businessId,
    }),
  });
  const result = await response.json();
  if (result.error) throw new Error(result.error);
  return result as APIResponse<ContactSegment>;
}

export async function addContactToSegment(
  contactSegmentId: string,
  contactId: string[],
) {
  const response = await fetch(`${API_BASE_URL}/contacts/segments/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contact_segment_id: contactSegmentId,
      contact_id: contactId,
    }),
  });
  const result = await response.json();
  if (result.error) throw new Error(result.error);
  return result as APIResponse<ContactSegment>;
}
