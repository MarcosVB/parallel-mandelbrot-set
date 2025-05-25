import WebSocket from "ws";
import { z } from "zod";
import os from "os";

const Image = z.object({
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

const Mandelbrot = z.object({
  iterations: z.number().int().positive(),
  reMin: z.number(),
  reMax: z.number(),
  imMin: z.number(),
  imMax: z.number(),
});

const Block = z.object({
  xStart: z.number().int(),
  yStart: z.number().int(),
  blockWidth: z.number().int().positive(),
  blockHeight: z.number().int().positive(),
});

export const UIParameters = Image.merge(Mandelbrot).extend({
  blockSize: z.number().int().positive(),
  threads: z.number().int().min(1).max(os.cpus().length),
});

export const ComputeMandelbrot = UIParameters.extend({
  ws: z.instanceof(WebSocket),
});

export const WorkerData = Image.merge(Mandelbrot).merge(Block);

export const WorkerResult = Block.extend({
  pixels: z.array(z.number()),
});
