import {
  googleProviderGetMailsService,
  googleProviderService,
  googleProviderTokensService,
} from "../services/providers.service.js";
import { decodeJWT } from "../utils/auth.js";
import { GOOGLE_SCOPES } from "../utils/constants.js";

export async function googleProviderController(req, res) {
  let scope;
  if (req.query.action === "MAIL") scope = GOOGLE_SCOPES.auth;
  const { data, error, status } = await googleProviderService(scope);
  res.status(status).send({ data, error });
}

export async function googleProviderTokensController(req, res) {
  const authToken = req.headers.authorization;
  if (!authToken) res.status(401).send({ error: "unauthorized" });
  const userId = decodeJWT(authToken).userId;
  if (!userId) res.status(401).send({ error: "unauthorized" });
  const { data, error, status } = await googleProviderTokensService(
    req.query.code,
    req.query.businessId,
    userId,
  );
  res.status(status).send({ data, error });
}

export async function googleProviderGetMailsController(req, res) {
  const authToken = req.headers.authorization;
  if (!authToken) res.status(401).send({ error: "unauthorized" });
  const userId = decodeJWT(authToken).userId;
  if (!userId) res.status(401).send({ error: "unauthorized" });
  const { data, error, status } = await googleProviderGetMailsService(userId);
  res.status(status).send({ data, error });
}
