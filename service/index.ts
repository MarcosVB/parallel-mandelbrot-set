import express from "express";
import { createServer } from "http";
import WebSocket from "ws";
import { computeMandelbrot } from "./core/main";
import path from "path";
import { UIParameters } from "./interfaces/interfaces";
import { z } from "zod";

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
): z.infer<typeof UIParameters> | undefined {
  try {
    const config = message.toString();
    const parsedConfig = JSON.parse(config);
    const validation = UIParameters.safeParse(parsedConfig);
    if (!validation.success) {
      throw new Error(
        `Invalid parameters: ${JSON.stringify(validation.error.errors)}`
      );
    }
    console.log("Config:", JSON.stringify(validation.data));
    return validation.data;
  } catch (error: any) {
    console.error(error);
    ws.send(error.message);
  }
  return undefined;
}
