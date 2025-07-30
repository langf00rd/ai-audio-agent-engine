import {
  createUserService,
  getUserService,
} from "../services/users.service.js";

export async function getUserController(req, res) {
  const { data, error, status } = await getUserService(req.query);
  res.status(status).send({ data, error });
}

export async function createUserController(req, res) {
  const { data, error, status } = await createUserService(req.body);
  res.status(status).send({ data, error });
}
