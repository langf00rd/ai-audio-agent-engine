import { createBusinessService } from "../services/business.service.js";

export async function createBusinessController(req, res) {
  const { data, error, status } = await createBusinessService(req.body);
  res.status(status).send({ data, error });
}
