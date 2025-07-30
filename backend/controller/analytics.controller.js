import {
  getAnalyticsByAgentId,
  trackAgentUsageService,
} from "../services/analytics.service.js";

export async function createAnalyticsController(req, res) {
  let response = { error: "pass a valid type", status: 500 };
  if (req.body.event_type === "AGENT_USAGE") {
    response = await trackAgentUsageService(req.body);
  }
  res.status(response.status).send({
    data: response.data,
    error: response.error,
    message: response.message,
  });
}

export async function getAnalyticsController(req, res) {
  let response;
  if (req.query.agent_id) {
    response = await getAnalyticsByAgentId(req.query.agent_id);
  }
  res.status(response.status).send({
    data: response.data,
    error: response.error,
    message: response.message,
  });
}
