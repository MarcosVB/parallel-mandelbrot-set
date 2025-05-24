const canvas = document.getElementById("mandelbrotCanvas");
const ctx = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;

const socket = new WebSocket(`ws://${location.host}`);

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
