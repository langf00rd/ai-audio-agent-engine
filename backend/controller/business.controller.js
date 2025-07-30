import {
  createBusinessService,
  getBusinessesService,
} from "../services/business.service.js";

export async function createBusinessController(req, res) {
  const { data, error, status } = await createBusinessService(req.body);
  res.status(status).send({ data, error });
}

export async function getBusinessController(req, res) {
  const { data, error, status } = await getBusinessesService(req.query);
  res.status(status).send({ data, error });
}
