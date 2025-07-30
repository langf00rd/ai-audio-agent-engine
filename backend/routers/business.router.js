import express from "express";
import {
  createBusinessController,
  getBusinessController,
} from "../controller/business.controller.js";
export const businessRouter = express.Router();
businessRouter.post("/", createBusinessController);
businessRouter.get("/", getBusinessController);
