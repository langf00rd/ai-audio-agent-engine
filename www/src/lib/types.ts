export interface APIResponse<T> {
  data: T;
  error: Error;
}

export interface User {
  id: number;
  created_at: Date;
  email: string;
  token: string;
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
