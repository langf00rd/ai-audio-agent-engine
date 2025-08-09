import express from "express";
import {
  createJobController,
  getJobController,
} from "../controller/jobs.controller.js";

export const jobsRouter = express.Router();

jobsRouter.get("/", getJobController);
jobsRouter.post("/", createJobController);
