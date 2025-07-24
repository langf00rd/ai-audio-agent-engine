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
      return `you will be provided with a user input and as a sales tagging model and returning markdown, you are tasked to return strictly only json containing these:
      intent [any of [${Object.values(conversationTags)}]], summary, lead_quality: any of [${Object.values(leadQuality)}], next_step: any of [${Object.values(conversationNextSteps)}], confidence: number (0-1). now tag this user input: "${prompt}"`;
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

export function pickJSONFromText(text) {
  const blockMatch = text.match(/```json\s*([\s\S]*?)\s*```/i);
  let jsonString;
  if (blockMatch) {
    jsonString = blockMatch[1];
  } else {
    const rawMatch = text.match(/{[\s\S]*}/);
    if (!rawMatch) throw new Error("JSON not found in text");
    jsonString = rawMatch[0];
  }
  try {
    return JSON.parse(jsonString);
  } catch (err) {
    throw new Error("Failed to parse JSON: " + err.message);
  }
}
