import { signInService, signUpService } from "../services/auth.service.js";

export async function signUpController(req, res) {
  const { data, error, status, message } = await signUpService(req.body);
  res.status(status).send({ data, error, message });
}

export async function signInController(req, res) {
  const { data, error, status, message } = await signInService(req.body);
  res.status(status).send({ data, error, message });
}
