import express from "express";
import {
  createAgentController,
  getAgentById,
  getAgents,
  updateAgent,
} from "../controller/agent.controller.js";
export const agentsRouter = express.Router();
agentsRouter.post("/", createAgentController);
agentsRouter.get("/", getAgents);
agentsRouter.get("/:id", getAgentById);
agentsRouter.put("/:id", updateAgent);
