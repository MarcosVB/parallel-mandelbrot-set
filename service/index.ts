import express from "express";
import { createServer } from "http";
import { WebSocket } from "ws";
import { computeMandelbrot } from "./core/main";
import path from "path";
import os from "os";

const PORT = 3000;
const THREADS = os.cpus().length;
const WIDTH = 800;
const HEIGHT = 600;
const BLOCK_SIZE = 10;

const app = express();
const server = createServer(app);
const wss = new WebSocket.Server({ server: server });

app.use(express.static(path.join(__dirname, "..", "src")));

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Threads: ${THREADS}`);
});

wss.on("connection", (ws) => {
  console.log("Client connected");
  computeMandelbrot({
    blockSize: BLOCK_SIZE,
    height: HEIGHT,
    threads: THREADS,
    width: WIDTH,
    ws,
  });
});
