import WebSocket from "ws";

interface IImage {
  width: number;
  height: number;
}

interface IMandelbrot {
  iterations: number;
  reMin: number;
  reMax: number;
  imMin: number;
  imMax: number;
}

interface IBlock {
  xStart: number;
  yStart: number;
  blockWidth: number;
  blockHeight: number;
}

export interface IComputeMandelbrot extends IImage, IMandelbrot {
  blockSize: number;
  threads: number;
  ws: WebSocket;
}

export interface IWorkerData extends IImage, IMandelbrot, IBlock {}

export interface IWorkerResult extends IBlock {
  pixels: number[];
}
