import { betterAuth } from "better-auth";

export const authClient = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
});
