import {
  createBusinessService,
  getBusinessesService,
  updateBusinessService,
} from "../services/business.service.js";

export async function createBusinessController(req, res) {
  const { data, error, status } = await createBusinessService(req.body);
  res.status(status).send({ data, error });
}

export async function updateBusinessController(req, res) {
  const { data, error, status } = await updateBusinessService(
    req.params.businessId,
    req.body,
  );
  res.status(status).send({ data, error });
}

export async function getBusinessController(req, res) {
  const { data, error, status } = await getBusinessesService(req.query);
  res.status(status).send({ data, error });
}
