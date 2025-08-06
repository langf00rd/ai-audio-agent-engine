import express from "express";
import {
  googleProviderController,
  googleProviderTokensController,
} from "../controller/providers.controller.js";

export const providersRouter = express.Router();

providersRouter.get("/auth/google", googleProviderController);
providersRouter.get("/auth/google/tokens", googleProviderTokensController);
