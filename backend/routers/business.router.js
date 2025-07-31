import express from "express";
import {
  createBusinessController,
  getBusinessController,
  updateBusinessController,
} from "../controller/business.controller.js";
export const businessRouter = express.Router();
businessRouter.post("/", createBusinessController);
businessRouter.put("/:businessId", updateBusinessController);
businessRouter.get("/", getBusinessController);
