import express from "express";
import {
  signInController,
  signUpController,
} from "../controller/auth.controller.js";
export const authRouter = express.Router();
authRouter.post("/sign-up", signUpController);
authRouter.post("/sign-in", signInController);
