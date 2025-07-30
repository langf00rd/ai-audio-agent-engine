export interface APIResponse<T> {
  data: T;
  error: Error;
}

export interface User {
  id: number;
  created_at: Date;
  email: string;
  token: string;
  first_name: string;
  last_name: string;
}

export interface Analytics<T> {
  id: number;
  created_at: Date;
  type: "AGENT_USAGE";
  user_id: null | number;
  metadata: T;
}

export interface AgentAnalyticsMetadata {
  agent_id: number;
  session_id: string;
}

export interface AgentAnalytics {
  totalInvocations: number;
  mostCommonDay: string;
}

export interface AgentConfig {
  id: number;
  name: string;
  description: string;
  business_name: string;
  business_slogan: string;
  brand_voice: string;
  support_contact: Record<string, string>;
  custom_interactions: Record<string, string>;
  service: AgentService[];
  faqs: AgentFAQ[];
  other_info?: string;
  is_public: boolean;
  created_at: Date;
}

export interface AgentService {
  name: string;
  description: string;
  pricing: AgentPricing[];
  [key: string]: unknown;
}

export interface AgentPricing {
  amount: number;
  currency: string;
}

export interface AgentFAQ {
  question: string;
  answer: string;
}

export interface KV {
  key: string;
  value: string;
}

export enum AgentAnalyticsChartDuration {
  DAY = "day",
  MONTH = "month",
}

export interface Conversation {
  id: number;
  session_id: string;
  agent_id: string;
  user: string;
  llm: string;
  created_at: Date;
}

export interface SessionConversation {
  session_id: string;
  messages: Conversation[];
  start_dt: Date;
  end_dt: Date;
}

export interface ConversationTag {
  id: string;
  created_at: Date;
  session_id: string;
  user_info: {
    name: string;
    email: string;
    phone: string;
    location: string;
  };
  intent: string;
  summary: string;
  lead_quality: string;
  next_step: string;
  confidence: number;
}

// v2
export interface Business {
  id: number;
  user_id: number;
  name: string;
  slogan: string;
  industry: string;
  description: string;
  website: string;
  contact_info: {
    phone: string;
    email: string;
  };
}

export interface Agent {
  id?: number;
  business_id: number;
  name: string;
  description?: string;
  custom_reactions?: Record<string, string>;
  is_public?: boolean;
  created_at: Date;
  updated_at?: Date;
}
