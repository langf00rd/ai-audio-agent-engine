import express from "express";
import {
  googleProviderController,
  googleProviderGetMailsController,
  googleProviderTokensController,
} from "../controller/providers.controller.js";

export const providersRouter = express.Router();

providersRouter.get("/auth/google", googleProviderController);
providersRouter.get("/auth/google/tokens", googleProviderTokensController);
providersRouter.get("/auth/google/mail", googleProviderGetMailsController);
