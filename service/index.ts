import express from "express";
import { createServer } from "http";
import { WebSocket } from "ws";
import { computeMandelbrot } from "./core/main";
import path from "path";

const PORT = 3000;

const app = express();
const server = createServer(app);
const wss = new WebSocket.Server({ server: server });

app.use(express.static(path.join(__dirname, "..", "src")));

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

wss.on("connection", (ws) => {
  console.log("Client connected");
  computeMandelbrot(ws);
});
