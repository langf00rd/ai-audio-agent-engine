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
    createAgent,
    getAgentByID,
    getAgents,
    updateAgent,
} from "./controller/agent.controller.js";
import { aiChatController } from "./controller/ai.controller.js";
import {
    analyticsController,
    getAnalyticsController,
} from "./controller/analytics.controller.js";
import {
    signInController,
    signUpController,
} from "./controller/auth.controller.js";
import {
    createConvoTaggingController,
    getConversationsController,
    getConvoTaggingController,
} from "./controller/conversations.controller.js";
import { ttsController } from "./controller/tts.controller.js";
import { handleWebSocketConnection } from "./utils/ws.js";

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
app.get("/", (_, res) => res.send(`SERVER IS UP`));
router.post("/agents", createAgent);
router.put("/agents/:id", updateAgent);
router.get("/agents", getAgents);
router.get("/agents/:id", getAgentByID);
router.post("/ai", aiChatController);
router.post("/auth/sign-up", signUpController);
router.post("/auth/sign-in", signInController);
router.post("/utils/tts", ttsController);
router.post("/analytics", analyticsController);
router.get("/analytics", getAnalyticsController);
router.get("/conversations", getConversationsController);
router.post("/conversations/tagging/:sessionId", createConvoTaggingController);
router.get("/conversations/tagging/:sessionId", getConvoTaggingController);

server.listen(PORT, () => console.log(`API RUNNING ON ${PORT}`));
