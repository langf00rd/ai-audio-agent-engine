import { getAuthTokenService } from "../services/auth-tokens.service.js";

export async function getAuthTokensController(req, res) {
  if (!req.query.business_id) res.status(400).send({ error: "invalid params" });
  const { data, error, status } = await getAuthTokenService(req.query);
  res.status(status).send({ data, error });
}
