import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import http from "http";
import { WebSocketServer } from "ws";
import { handleWebSocketConnection } from "./utils/ws.js";
import {
  createAgent,
  getAgentByID,
  getAgents,
} from "./controller/agent.controller.js";
import cors from "cors";
import { aiChat } from "./controller/ai.controller.js";

const PORT = 8000;
const app = express();
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

wss.on("connection", async (ws) => {
  console.log("client connected");
  handleWebSocketConnection(ws);
});

app.get("/", (_, res) => res.send(`server running`));
app.post("/agents", createAgent);
app.get("/agents", getAgents);
app.get("/agents/:id", getAgentByID);
app.post("/ai", aiChat);

server.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`));
