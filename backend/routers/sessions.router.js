import express from "express";
import { createSessionController } from "../controller/sessions.controller.js";
export const sessionsRouter = express.Router();
sessionsRouter.post("/", createSessionController);
