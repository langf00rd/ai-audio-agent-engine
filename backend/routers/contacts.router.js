import express from "express";
import {
  createContactController,
  getContactController,
} from "../controller/contacts.controller.js";

export const contactsRouter = express.Router();

contactsRouter.post("/", createContactController);
contactsRouter.get("/", getContactController);
