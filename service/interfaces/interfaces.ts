import WebSocket from "ws";

export interface IComputeMandelbrot {
  blockSize: number;
  height: number;
  threads: number;
  width: number;
  ws: WebSocket;
}

export interface IWorkerData {
  xStart: number;
  yStart: number;
  width: number;
  height: number;
  totalWidth: number;
  totalHeight: number;
}
