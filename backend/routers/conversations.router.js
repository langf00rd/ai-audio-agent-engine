import express from "express";
import {
  analyzeConversationsController,
  createConversationController,
  getConversationsController,
  getAnalyzedConversationsController,
} from "../controller/conversations.controller.js";
export const conversationsRouter = express.Router();
conversationsRouter.post("/", createConversationController);
conversationsRouter.get("/", getConversationsController);
conversationsRouter.post("/analyze/:sessionId", analyzeConversationsController);
conversationsRouter.get(
  "/analyze/:sessionId",
  getAnalyzedConversationsController,
);
