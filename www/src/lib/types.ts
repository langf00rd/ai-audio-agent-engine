export type Agent = {
  id: number;
  name: string;
  description: string;
  intro_script: string;
  audience: {
    industry: string;
    location: string;
    income_level: string;
  };
  objections_and_responses: Record<string, string>;
};

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
  uniqueSessions: number;
  mostCommonDay: string;
}
