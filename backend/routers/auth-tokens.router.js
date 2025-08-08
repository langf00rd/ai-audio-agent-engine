import express from "express";
import { getAuthTokensController } from "../controller/auth-tokens.controller.js";

export const authTokensRouter = express.Router();

authTokensRouter.get("/", getAuthTokensController);
