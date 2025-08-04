import { PollyClient } from "@aws-sdk/client-polly";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

export const polly = new PollyClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const elevenLabs = {
  client: new ElevenLabsClient({
    apiKey: process.env.ELEVENLABS_API_KEY,
  }),
  voiceId: process.env.ELEVENLABS_VOICE_ID,
  modelId: "eleven_flash_v2_5",
};
