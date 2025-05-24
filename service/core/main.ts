import path from "path";
import Piscina from "piscina";
import WebSocket from "ws";

const WIDTH = 800;
const HEIGHT = 600;
const BLOCK_SIZE = 40;

export async function computeMandelbrot(ws: WebSocket) {
  const tasks = [];

  const piscina = new Piscina({
    filename: path.join(__dirname, "worker.js"),
    maxThreads: 4,
  });

  for (let y = 0; y < HEIGHT; y += BLOCK_SIZE) {
    for (let x = 0; x < WIDTH; x += BLOCK_SIZE) {
      tasks.push({
        xStart: x,
        yStart: y,
        width: BLOCK_SIZE,
        height: BLOCK_SIZE,
        totalWidth: WIDTH,
        totalHeight: HEIGHT,
      });
    }
  }

  tasks.forEach(async (task) => {
    const result = await piscina.run(task);
    ws.send(JSON.stringify({ type: "block", data: result }));
  });
}
