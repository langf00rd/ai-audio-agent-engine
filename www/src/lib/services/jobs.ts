import { API_BASE_URL } from "../constants";
import { APIResponse, Job } from "../types";

export async function fetchJobs(businessId: string) {
  const response = await fetch(
    `${API_BASE_URL}/jobs?business_id=${businessId}`,
  );
  const result = await response.json();
  if (result.error) throw new Error(result.error);
  return result as APIResponse<Job[]>;
}

export async function createJob(job: Job | Record<string, unknown>) {
  const response = await fetch(`${API_BASE_URL}/jobs`, {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify(job),
  });
  const result = await response.json();
  if (result.error) throw new Error(result.error);
  return result as APIResponse<Job[]>;
}
