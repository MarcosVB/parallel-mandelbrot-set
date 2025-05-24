import express from "express";
import { createServer } from "http";
import { WebSocket } from "ws";
import { computeMandelbrot } from "./core/main";
import path from "path";
import os from "os";
import { IComputeMandelbrot } from "./interfaces/interfaces";

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

  ws.on("message", (message) => {
    try {
      const {
        width,
        height,
        blockSize,
        threads = os.cpus().length,
        reMin,
        reMax,
        imMin,
        imMax,
        iterations,
      }: IComputeMandelbrot = JSON.parse(message.toString());

      console.log("Received config:", {
        width,
        height,
        blockSize,
        threads,
        reMin,
        reMax,
        imMin,
        imMax,
        iterations,
      });

      computeMandelbrot({
        width,
        height,
        blockSize,
        threads,
        reMin,
        reMax,
        imMin,
        imMax,
        iterations,
        ws,
      });
    } catch (e) {
      console.error("Invalid message format", e);
      ws.send("Error: Invalid configuration.");
    }
  });
});

wss.on("close", () => {
  console.log("Client disconnected");
});

wss.on("error", (error) => {
  console.error("WebSocket error:", error);
});
