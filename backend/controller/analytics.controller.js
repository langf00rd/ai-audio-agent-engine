import {
  getAnalyticsByAgentId,
  trackAgentUsageService,
} from "../services/analytics.service.js";

export async function analyticsController(req, res) {
  console.log(req.query);
  let response = { error: "pass a valid type", status: 500 };
  if (req.body.type === "AGENT_USAGE") {
    response = await trackAgentUsageService(req.body);
  }
  res.status(response.status).send({
    data: response.data,
    error: response.error,
    message: response.message,
  });
}

export async function getAnalyticsController(req, res) {
  let response = { error: "no agent id passed", status: 500 };
  if (req.query.agent_id) {
    response = await getAnalyticsByAgentId(req.query.agent_id);
  }
  res.status(response.status).send({
    data: response.data,
    error: response.error,
    message: response.message,
  });
}
