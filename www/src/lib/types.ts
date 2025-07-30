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
  businesses: Business[];
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
  id: number | string;
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

export interface Session {
  id: string;
  agent_id: number | string;
  start_dt: Date;
  end_dt: Date | null;
}

export interface Conversation {
  id: string | number;
  session_id: string;
  agent_id: string | number;
  user_input: string;
  llm_response: string;
  is_analyzed: boolean;
  created_at: Date;
}

export interface AnalyzedConversation {
  id: string | number;
  session_id: string | null;
  summary: string | null;
  intent: string | null;
  lead_quality: string | null;
  next_step: string | null;
  confidence: number | null;
  metadata: Record<string, unknown>;
  customer: {
    name: string | null;
    email: string | null;
    phone: string | null;
    location: string | null;
  } | null;
  created_at: Date;
}
