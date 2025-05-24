import WebSocket from "ws";

export interface IComputeMandelbrot {
  blockSize: number;
  height: number;
  threads: number;
  iterations: number;
  width: number;
  reMin: number;
  reMax: number;
  imMin: number;
  imMax: number;
  ws: WebSocket;
}

export interface IWorkerData {
  xStart: number;
  yStart: number;
  blockWidth: number;
  blockHeight: number;
  totalWidth: number;
  totalHeight: number;
  reMin: number;
  reMax: number;
  imMin: number;
  imMax: number;
  iterations: number;
}

export interface IWorkerResult {
  xStart: number;
  yStart: number;
  blockWidth: number;
  blockHeight: number;
  pixels: number[];
}
