import { z } from "zod";
import {
  conversationIntent,
  conversationNextSteps,
  leadQuality,
} from "./constants.js";

export const analyzeConversationSchema = z.object({
  customer: z.object({
    name: z.string(),
    email: z.string(),
    phone: z.string(),
    location: z.string(),
  }),
  intent: z.enum(Object.values(conversationIntent)),
  summary: z.string(),
  lead_quality: z.enum(Object.values(leadQuality)),
  next_step: z.enum(Object.values(conversationNextSteps)),
  confidence: z.number().min(0).max(1),
  metadata: z.record(z.union([z.string(), z.number()])),
});
