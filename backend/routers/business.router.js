import express from "express";
import { createBusinessController } from "../controller/business.controller.js";
export const businessRouter = express.Router();
businessRouter.post("/", createBusinessController);
