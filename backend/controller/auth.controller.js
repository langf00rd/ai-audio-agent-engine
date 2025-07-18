import { signUpService } from "../services/auth.service.js";

export async function signUpController(req, res) {
  const { data, error, status } = await signUpService(req.body);
  res.status(status).send({ data, error });
}
