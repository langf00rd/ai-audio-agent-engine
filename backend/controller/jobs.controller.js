import { createJobService, getJobService } from "../services/job.service.js";

export async function createJobController(req, res) {
  const { data, error, status } = await createJobService(req.body);
  res.status(status).send({ data, error });
}

export async function getJobController(req, res) {
  const { data, error, status } = await getJobService(req.query);
  res.status(status).send({ data, error });
}
