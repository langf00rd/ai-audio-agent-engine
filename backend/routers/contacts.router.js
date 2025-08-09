import express from "express";
import {
  addContactsToSegmentController,
  createContactController,
  createContactSegmentController,
  getContactController,
  getContactSegmentController,
} from "../controller/contacts.controller.js";

export const contactsRouter = express.Router();

contactsRouter.post("/", createContactController);
contactsRouter.get("/", getContactController);
contactsRouter.post("/segments", createContactSegmentController);
contactsRouter.get("/segments", getContactSegmentController);
contactsRouter.post("/segments/add", addContactsToSegmentController);
