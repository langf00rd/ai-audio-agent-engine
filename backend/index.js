import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import {
  createAgent,
  getAgentByID,
  getAgents,
  updateAgent,
} from "./controller/agent.controller.js";
import {
  aiChatController,
  taggingController,
} from "./controller/ai.controller.js";
import {
  signInController,
  signUpController,
} from "./controller/auth.controller.js";
import { ttsController } from "./controller/tts.controller.js";
import { handleWebSocketConnection } from "./utils/ws.js";
import {
  analyticsController,
  getAnalyticsController,
} from "./controller/analytics.controller.js";

const PORT = 8000;
const app = express();
const router = express.Router();
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: "/ws" });

dotenv.config({ path: ".env" });

app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.use("/api", router); // all routes under /api

wss.on("connection", async (ws) => {
  console.log("web socket client connected");
  handleWebSocketConnection(ws);
});

app.get("/", (_, res) => res.send(`server running`));
router.post("/agents", createAgent);
router.put("/agents/:id", updateAgent);
router.get("/agents", getAgents);
router.get("/agents/:id", getAgentByID);
router.post("/ai", aiChatController);
router.post("/ai/tagging", taggingController);
router.post("/auth/sign-up", signUpController);
router.post("/auth/sign-in", signInController);
router.post("/utils/tts", ttsController);
router.post("/analytics", analyticsController);
router.get("/analytics", getAnalyticsController);

server.listen(PORT, () => console.log(`listening on ${PORT}`));
