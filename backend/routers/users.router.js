import express from "express";
import { createUserController } from "../controller/users.controller.js";
export const usersRouter = express.Router();
usersRouter.post("/", createUserController);
