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
      return `extract user intent and info and return JSON:
    input: ${prompt}
    output format:
    {
      "intent": any [${Object.values(conversationTags)}],
      "lead_quality": any [${Object.values(leadQuality)}],
      "next_step": any [${Object.values(conversationNextSteps)}],
      "confidence": 0.87,
      summary: one sentence,
      "tags": array of 3-5 keywords
    }`;
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
