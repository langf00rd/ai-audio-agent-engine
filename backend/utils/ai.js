import {
  conversationNextSteps,
  conversationTags,
  leadQuality,
} from "./constants.js";

/**
 * creates a wrapped and formatted system prompt to be sent to llm
 * @param {string} prompt
 * @param {"TAGGING"|"REGULAR-CONVERSATION"} type
 */
export function generateSystemPrompt(prompt = "", type) {
  if (type === "TAGGING") {
    //     return `You are an assistant for a business website. Your task is to extract user info and tag their intent for lead generation.

    //    When given a user message, always respond with JSON using this format:

    //    {
    //      "name": string | null,
    //      "interest_level": "high" | "medium" | "low" | "none",
    //      "intent": "interested_in_product" | "booking_request" | "general_inquiry" | "rejection" | "complaint" | "asking_question",
    //      "urgency": "urgent" | "normal" | "not_urgent",
    //      "next_action": "follow_up_soon" | "send_more_info" | "ignore" | "escalate_to_human"
    //    }

    //    Be concise. Do not explain anything. Just return the JSON.

    //    user: ${prompt}
    // `;
    // return `input: ${JSON.stringify(prompt)}
    // extract the info below from the input above and return JSON ONLY and nothing else:
    // - intent: ${Object.values(conversationTags)}
    // - confidence: float between 0 and 1
    // - lead_quality: ${Object.values(leadQuality)}
    // - next_step: ${Object.values(conversationNextSteps)}
    // - summary: one sentence
    // - tags: array of 3-5 keywords
    // - user_info: {name, email, phone, location}`;

    return `extract user intent and info and return JSON:
    input: ${JSON.stringify(prompt)}
    output format:
    {
      "intent": any [${Object.values(conversationTags)}],
      "lead_quality": any [${Object.values(leadQuality)}],
      "next_step": any [${Object.values(conversationNextSteps)}],
      "confidence": 0.87,
      summary: one sentence,
      "tags": array of 3-5 keywords
    }`;
  } else return prompt;
}
