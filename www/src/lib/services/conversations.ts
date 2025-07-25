import { API_BASE_URL } from "../constants";
import { APIResponse, ConversationTag, SessionConversation } from "../types";

export async function fetchAgentSessionConversations(agentId: string | number) {
    const response = await fetch(
        `${API_BASE_URL}/conversations?agent_id=${agentId}&order_by=session`,
    );
    const result = await response.json();
    if (result.error) throw new Error(result.error);
    return result as APIResponse<SessionConversation[]>;
}

export async function fetchAgentTaggedConversations(sessionId: string) {
    const response = await fetch(
        `${API_BASE_URL}/conversations/tagging/${sessionId}`,
    );
    const result = await response.json();
    if (result.error) throw new Error(result.error);
    return result as APIResponse<ConversationTag>;
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
