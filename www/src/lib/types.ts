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
  id: string;
  created_at: Date;
  email: string;
  token: string;
}
