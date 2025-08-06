import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

export const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.CLIENT_BASE_URL}/providers/callback/google`,
);
