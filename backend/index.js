import dotenv from "dotenv";
import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import { handleWebSocketConnection } from "./utils/ws.js";

dotenv.config({ path: ".env" });

const PORT = 8000;
const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: "/ws" });

wss.on("connection", async (ws) => {
  console.log("client connected");
  handleWebSocketConnection(ws);
});

app.get("/", (res) => res.send(`server running`));

server.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`));
