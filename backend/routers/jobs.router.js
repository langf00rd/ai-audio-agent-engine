import express from "express";
import { createJobController } from "../controller/jobs.controller.js";

export const jobsRouter = express.Router();

jobsRouter.post("/", createJobController);
