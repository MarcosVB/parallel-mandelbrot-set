import WebSocket from "ws";

export interface IComputeMandelbrot {
  blockSize: number;
  height: number;
  threads: number;
  width: number;
  reMin: number;
  reMax: number;
  imMin: number;
  imMax: number;
  iterations: number;
  ws: WebSocket;
}

export interface IWorkerData {
  xStart: number;
  yStart: number;
  width: number;
  height: number;
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
  width: number;
  height: number;
  pixels: number[];
}
