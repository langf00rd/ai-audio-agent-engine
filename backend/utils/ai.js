import {
    conversationNextSteps,
    conversationIntent,
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
            return `you are given an a convo history with user input and llm response. as a sales convo tagging model, extract relevant info and return ALONE STRICTLY stringified json matching this schema slotted with the info you extract and deduce: {"user_info":{"name":"string","email":"string","phone":"string","location":"string"},"intent":"${Object.values(conversationIntent)}","summary":"string","lead_quality":"${Object.values(leadQuality)}","next_step":"${Object.values(conversationNextSteps)}","confidence":"float"}. now tag this conversation: "${JSON.stringify(prompt)}"`;
        case "REGULAR-CONVERSATION":
            return `you are a sales agent. your info and service/product ${JSON.stringify(opt.agentInfo)}. keep replies very short, casual, and human. ask only one question in a single sentence block. avoid robotic tone. if something isn’t covered, ask them to contact support. if you sense a positive vibe, ask for customer information naturally (mainly name, location, phone/email). never force it. now  continue the conversation from this history: ${JSON.stringify(opt.history)}. no emojis. now respond: ${JSON.stringify(prompt)}`;
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
        throw new Error("failed to parse JSON: " + err.message);
    }
}
