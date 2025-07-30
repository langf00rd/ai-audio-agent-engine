import { API_BASE_URL } from "../constants";
import {
  AnalyzedConversation,
  APIResponse,
  Conversation,
  ConversationTag,
} from "../types";

export async function fetchSessionConversations(sessionId: string | number) {
  const response = await fetch(
    `${API_BASE_URL}/conversations?session_id=${sessionId}`,
  );
  const result = await response.json();
  if (result.error) throw new Error(result.error);
  return result as APIResponse<Conversation[]>;
}

export async function fetchAnalyzedConversation(sessionId: string) {
  const response = await fetch(
    `${API_BASE_URL}/conversations/analyze/${sessionId}`,
  );
  const result = await response.json();
  if (result.error) throw new Error(result.error);
  return result as APIResponse<AnalyzedConversation>;
}

export async function analyzeConversation(sessionId: string) {
  const response = await fetch(
    `${API_BASE_URL}/conversations/analyze/${sessionId}`,
    {
      method: "POST",
    },
  );
  const result = await response.json();
  if (result.error) throw new Error(result.error);
  return result as APIResponse<AnalyzedConversation>;
}

export async function taggedConversation(sessionId: string) {
  const response = await fetch(
    `${API_BASE_URL}/conversations/tagging/${sessionId}`,
    { method: "POST" },
  );
  const result = await response.json();
  if (result.error) throw new Error(result.error);
  return result as APIResponse<ConversationTag>;
}
