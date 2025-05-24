import express from "express";
import { createServer } from "http";
import WebSocket from "ws";
import { computeMandelbrot } from "./core/main";
import path from "path";
import { IComputeMandelbrot } from "./interfaces/interfaces";
// import os from "os";

const PORT = 3000;
// const threads = os.cpus().length;
const app = express();
const server = createServer(app);
const wss = new WebSocket.Server({ server: server });

app.use(express.static(path.join(__dirname, "..", "src")));

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (message) => {
    const config = parseConfig(ws, message);
    if (config) {
      computeMandelbrot({ ...config, ws });
    }
  });
});

wss.on("close", () => {
  console.log("Client disconnected");
});

wss.on("error", (error) => {
  console.error("WebSocket error:", error);
});

function parseConfig(
  ws: WebSocket.WebSocket,
  message: WebSocket.RawData
): IComputeMandelbrot | undefined {
  try {
    const config = message.toString();
    console.log("Received config:", config);
    return JSON.parse(config);
  } catch (error) {
    console.error("Invalid message format", error);
    ws.send("Error: Invalid configuration.");
  }
  return undefined;
}
