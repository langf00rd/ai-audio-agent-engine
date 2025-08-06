import { google } from "googleapis";
import { oAuth2Client } from "../config/google.js";

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

export async function googleProviderTokensService(code) {
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    return {
      status: 200,
      data: {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
      },
    };
  } catch (error) {
    return {
      error: error.message,
      status: 500,
    };
  }
}

export async function googleProviderGetMailsService(accessToken, refreshToken) {
  try {
    // create a new temporal oauth2 client
    const _oAuth2Client = oAuth2Client;
    _oAuth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    const gmail = google.gmail({ version: "v1", auth: _oAuth2Client });
    const res = await gmail.users.messages.list({
      userId: "me",
      maxResults: 10,
    });
    const messages = [];
    for (const message of res.data.messages) {
      const msg = await gmail.users.messages.get({
        userId: "me",
        id: message.id,
      });
      messages.push(msg);
    }
    return {
      status: 200,
      data: messages.map((a) => {
        return {
          labels: a.data.labelIds,
          subject: a.data.snippet,
        };
      }),
    };
  } catch (error) {
    return {
      error: error.message,
      status: 500,
    };
  }
}
