import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import querystring from "querystring";
import { parse } from "url";
import { WebSocketServer } from "ws";
import { initDb } from "./config/sqlite.js";
import {
  analyticsController,
  getAnalyticsController,
} from "./controller/analytics.controller.js";
import {
  createConvoTaggingController,
  getConversationsController,
  getConvoTaggingController,
} from "./controller/conversations.controller.js";
import { ttsController } from "./controller/tts.controller.js";
import { agentsRouter } from "./routers/agents.router.js";
import { authRouter } from "./routers/auth.router.js";
import { businessRouter } from "./routers/business.router.js";
import { usersRouter } from "./routers/users.router.js";
import { handleWebSocketConnection } from "./utils/ws.js";
import { sessionsRouter } from "./routers/sessions.router.js";
import { conversationsRouter } from "./routers/conversations.router.js";

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

wss.on("connection", async (ws, req) => {
  const { query } = parse(req.url);
  const params = querystring.parse(query);
  console.log("[web socket] client connected", params);
  handleWebSocketConnection(ws, params.agentId);
});

app.use("/api", router); // all routes under /api
app.use("/api/businesses", businessRouter);
app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);
app.use("/api/agents", agentsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/conversations", conversationsRouter);

app.get("/", (_, res) => res.send(`SERVER IS UP`));

router.post("/utils/tts", ttsController);
router.post("/analytics", analyticsController);
router.get("/analytics", getAnalyticsController);

// router.get("/conversations", getConversationsController);
// router.post("/conversations/tagging/:sessionId", createConvoTaggingController);
// router.get("/conversations/tagging/:sessionId", getConvoTaggingController);

server.listen(PORT, () => console.log(`API RUNNING ON ${PORT}`));
