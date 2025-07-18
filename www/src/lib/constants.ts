export const API_BASE_URL = `http://localhost:8000`;
export const ROUTES = {
  index: "/",
  agent: {
    index: "/agents",
    create: "/agents/create",
  },
  auth: {
    signIn: "/auth/sign-in",
    signUp: "/auth/sign-up",
  },
};
export const COOKIE_KEYS = {
  token: "tk",
};
