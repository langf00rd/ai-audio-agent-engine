import express from "express";
import {
  createSessionController,
  getSessionController,
  updateSessionController,
} from "../controller/sessions.controller.js";
export const sessionsRouter = express.Router();
sessionsRouter.post("/", createSessionController);
sessionsRouter.put("/", updateSessionController);
sessionsRouter.get("/", getSessionController);
