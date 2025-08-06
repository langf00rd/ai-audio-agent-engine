import {
  googleProviderService,
  googleProviderTokensService,
} from "../services/providers.service.js";
import { GOOGLE_SCOPES } from "../utils/constants.js";

export async function googleProviderController(req, res) {
  let scope;
  if (req.query.action === "MAIL") scope = GOOGLE_SCOPES.auth;
  const { data, error, status } = await googleProviderService(scope);
  res.status(status).send({ data, error });
}

export async function googleProviderTokensController(req, res) {
  const { data, error, status } = await googleProviderTokensService(
    req.query.code,
  );
  res.status(status).send({ data, error });
}
