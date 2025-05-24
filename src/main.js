const canvas = document.getElementById("mandelbrotCanvas");
const ctx = canvas.getContext("2d");
const socket = new WebSocket(`ws://${location.host}`);

let width = canvas.width;
let height = canvas.height;

document.getElementById("startRender").onclick = () => {
  width = parseInt(document.getElementById("inputWidth").value);
  height = parseInt(document.getElementById("inputHeight").value);
  const blockSize = parseInt(document.getElementById("inputBlockSize").value);
  const threads = parseInt(document.getElementById("inputThreads").value);
  const reMin = parseFloat(document.getElementById("inputRealMin").value);
  const reMax = parseFloat(document.getElementById("inputRealMax").value);
  const imMin = parseFloat(document.getElementById("inputImaginaryMin").value);
  const imMax = parseFloat(document.getElementById("inputImaginaryMax").value);
  const iterations = parseInt(document.getElementById("inputIterations").value);

  canvas.width = width;
  canvas.height = height;
  ctx.clearRect(0, 0, width, height);

  const config = {
    width,
    height,
    blockSize,
    threads,
    reMin,
    reMax,
    imMin,
    imMax,
    iterations,
  };
  socket.send(JSON.stringify(config));
};

socket.onopen = () => {
  console.log("Connected to Mandelbrot WebSocket server");
};

socket.onmessage = (event) => {
  const message = JSON.parse(event.data);
  if (message.type === "block") {
    drawBlock(message.data);
  }
};

function drawBlock(data) {
  const { xStart, yStart, width, height, pixels } = data;
  const imageData = ctx.createImageData(width, height);

  for (let i = 0; i < pixels.length; i++) {
    const iter = pixels[i];
    const color = iter === 1000 ? 0 : 255 - (iter % 255);
    const base = i * 4;
    imageData.data[base + 0] = color;
    imageData.data[base + 1] = color;
    imageData.data[base + 2] = color;
    imageData.data[base + 3] = 255;
  }

  ctx.putImageData(imageData, xStart, yStart);
}
