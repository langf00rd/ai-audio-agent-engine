import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import { initDb } from "./config/sqlite.js";
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
import {
  analyticsController,
  getAnalyticsController,
} from "./controller/analytics.controller.js";
import { handleWebSocketConnection } from "./utils/ws.js";
import { getConversationsController } from "./controller/conversations.controller.js";

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

// init sqlite db
(async () => {
  try {
    await initDb();
    console.log("[SQLITE] DB INITIALIZED");
  } catch (err) {
    console.log("[SQLITE] ERROR", err);
  }
})();

wss.on("connection", async (ws) => {
  console.log("web socket client connected");
  handleWebSocketConnection(ws);
});

app.use("/api", router); // all routes under /api
app.get("/", (_, res) => res.send(`SERVER IS UP`));
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
router.get("/conversations", getConversationsController);

server.listen(PORT, () => console.log(`API RUNNING ON ${PORT}`));
