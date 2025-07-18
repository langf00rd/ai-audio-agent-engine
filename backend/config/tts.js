import { PollyClient } from "@aws-sdk/client-polly";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

export const polly = new PollyClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
