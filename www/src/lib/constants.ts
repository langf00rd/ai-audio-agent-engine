export const API_BASE_URL = `http://localhost:8000`;
export const WEB_SOCKET_URL = `ws://localhost:8000/ws`;
export const ROUTES = {
  index: "/",
  app: "/app",
  agent: {
    index: "/app/agents",
    create: "/app/agents/create",
  },
  auth: {
    signIn: "/auth/sign-in",
    signUp: "/auth/sign-up",
  },
};
export const COOKIE_KEYS = {
  token: "tk",
  user: "user",
};
export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
