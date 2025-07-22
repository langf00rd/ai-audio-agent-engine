import {
  conversationNextSteps,
  conversationTags,
  leadQuality,
} from "./constants.js";

/**
 * creates a wrapped and formatted system prompt to be sent to llm
 * @param {string} prompt
 * @param {"TAGGING"|"REGULAR-CONVERSATION"} type
 * @param {{agentInfo:{},history:{llm:string,user:string}[]}} opt
 */
export function generateSystemPrompt(prompt = "", type, opt) {
  switch (type) {
    case "TAGGING":
      return `You are a smart lead intent tagging assistant for a sales AI.

    Given a customer message "${prompt}", analyze it and return a valid JSON object with these keys:

    {
      "intent": one of  [${Object.values(conversationTags)}],
      "lead_quality": one of  [${Object.values(leadQuality)}],
      "next_step": one of [${Object.values(conversationNextSteps)}],
      "confidence": number from 0 to 1,
      "summary": a short 1-sentence summary of the user's intent,
      "tags": relevant keywords as an array of strings
    }

    Always return ONLY the JSON. No extra text, comments, or formatting.
`;
      return `extract the data below and return JSON from this user message "${prompt}"
    {
      "intent": any of [${Object.values(conversationTags)}],
      "lead_quality": any of [${Object.values(leadQuality)}],
      "next_step": any of [${Object.values(conversationNextSteps)}],
      "confidence": number (0-1),
      summary: string,
      "tags": string array
    }. maintain the json keys as shared above and do not return anything else other than the json`;
    case "REGULAR-CONVERSATION":
      return `you are a sales agent. your info and service/product ${JSON.stringify(opt.agentInfo)}. keep replies short, casual, and human. avoid robotic tone. if something isn’t covered, ask them to contact support. continue the conversation from this history: ${JSON.stringify(opt.history)}. no emojis. now respond: ${prompt}`;
    default:
      return prompt;
  }
}

/**
 * parses conversation session history to a format consumeable by llm
 * @param {{llm:string,user:string}[]} history - conversation session history array
 * @returns formatted conversation history for llm
 */
export function parseConversationSessionHistory(history = []) {
  return history.map((a) => {
    return { llm: a.llm, user: a.user };
  });
}
