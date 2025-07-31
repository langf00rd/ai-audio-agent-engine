export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export const WEB_SOCKET_URL = process.env.NEXT_PUBLIC_WEB_SOCKET_BASE_URL;
export const ROUTES = {
  index: "/",
  demo: "/demo.html",
  app: {
    index: "/app",
    agents: {
      index: "/app/agents",
      create: "/app/agents/create",
    },
    settings: "/app/settings",
  },
  agent: {
    index: "/app/agents",
    create: "/app/agents/create",
  },
  onboard: {
    business: "/onboard/business",
  },
  auth: {
    signIn: "/auth/sign-in",
    signUp: "/auth/sign-up",
  },
  about: "#",
  blog: "#",
  contact: "#",
};
export enum COOKIE_KEYS {
  token = "token",
  user = "user",
  business = "business",
  currentBusiness = "current_business",
}
export const AUDIO_INPUT_SILENCE_THRESHOLD_DURATION = 2000;
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
