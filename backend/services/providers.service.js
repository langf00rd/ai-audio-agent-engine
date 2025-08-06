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
