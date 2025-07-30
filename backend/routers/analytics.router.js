import express from "express";
import {
  createAnalyticsController,
  getAnalyticsController,
} from "../controller/analytics.controller.js";
export const analyticsRouter = express.Router();
analyticsRouter.post("/", createAnalyticsController);
analyticsRouter.get("/", getAnalyticsController);
