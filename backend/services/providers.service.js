import { google } from "googleapis";
import { oAuth2Client } from "../config/google.js";
import {
  createAuthTokenService,
  getAuthTokenService,
} from "./auth-tokens.service.js";
import { compare, hash } from "bcrypt";
import { pool } from "../config/pg.js";
import { decrypt, encrypt } from "../utils/security.js";

export async function googleProviderService(scope) {
  try {
    const url = oAuth2Client.generateAuthUrl({
      scope,
      access_type: "offline",
      prompt: "consent",
    });
    return {
      data: url,
      status: 200,
    };
  } catch (error) {
    return {
      error: error.message,
      status: 500,
    };
  }
}

export async function googleProviderTokensService(code, businessId, userId) {
  try {
    const { tokens } = await oAuth2Client.getToken(code);

    const { status, error } = await createAuthTokenService({
      access_token: encrypt(tokens.access_token),
      refresh_token: encrypt(tokens.refresh_token),
      expires_at: new Date(tokens.expiry_date).toISOString(),
      user_id: userId,
      provider: "GOOGLE_GMAIL",
      business_id: businessId,
    });

    // update user google gmail provider connection status in DB
    // await pool.query(
    //   `UPDATE users
    //    SET google_gmail_provider_connected = TRUE,
    //        google_gmail_provider_connected_at = NOW()
    //    WHERE id = $1`,
    //   [userId],
    // );

    return {
      status,
      error,
    };
  } catch (error) {
    return {
      error: error.message,
      status: 500,
    };
  }
}

export async function googleProviderGetMailsService(userId) {
  try {
    const { data, error, status } = await getAuthTokenService({
      user_id: userId,
    });

    if (error) {
      return {
        status,
        error,
      };
    }

    const accessToken = decrypt(data.access_token);
    const refreshToken = decrypt(data.refresh_token);

    // create a new temporal oauth2 client with user credentials
    const _oAuth2Client = oAuth2Client;
    _oAuth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    const gmail = google.gmail({ version: "v1", auth: _oAuth2Client });

    const res = await gmail.users.messages.list({
      userId: "me",
      // q: "from:example@gmail.com",
      maxResults: 10,
    });

    const threadsMap = new Map();

    function getPlainTextBody(payload) {
      if (!payload) return "";
      if (payload.mimeType === "text/plain" && payload.body?.data) {
        return Buffer.from(payload.body.data, "base64").toString("utf-8");
      }
      if (Array.isArray(payload.parts)) {
        for (const part of payload.parts) {
          const text = getPlainTextBody(part);
          if (text) return text;
        }
      }
      return "";
    }

    for (const message of res.data.messages || []) {
      const msg = await gmail.users.messages.get({
        userId: "me",
        id: message.id,
      });

      const threadId = msg.data.threadId;
      if (threadsMap.has(threadId)) continue;

      const threadRes = await gmail.users.threads.get({
        userId: "me",
        id: threadId,
      });

      const formattedThread = (threadRes.data.messages || []).map((email) => {
        const headers = email.payload.headers;
        const from = headers.find((h) => h.name === "From")?.value || "Unknown";
        const to = headers.find((h) => h.name === "To")?.value || "Unknown";
        const subject =
          headers.find((h) => h.name === "Subject")?.value || "(No Subject)";
        const date = headers.find((h) => h.name === "Date")?.value || "Unknown";
        const text = getPlainTextBody(email.payload);
        return { from, to, subject, date, text };
      });

      const firstMsg = formattedThread[0];

      threadsMap.set(threadId, {
        id: message.id,
        threadId,
        from: firstMsg.from,
        to: firstMsg.to,
        subject: firstMsg.subject,
        thread: formattedThread,
      });
    }

    return {
      status: 200,
      data: Array.from(threadsMap.values()),
    };
  } catch (error) {
    return {
      status: 500,
      error: error.message,
    };
  }
}
