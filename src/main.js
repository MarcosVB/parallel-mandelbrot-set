const canvas = document.getElementById("mandelbrotCanvas");
const ctx = canvas.getContext("2d");
const socket = new WebSocket(`ws://${location.host}`);

const inputWidth = document.getElementById("inputWidth");
const inputHeight = document.getElementById("inputHeight");
const inputBlockSize = document.getElementById("inputBlockSize");
const inputThreads = document.getElementById("inputThreads");
const inputIterations = document.getElementById("inputIterations");
const inputReal = document.getElementById("inputReal");
const inputImaginary = document.getElementById("inputImaginary");
const inputZoom = document.getElementById("inputZoom");

document.getElementById("startRender").onclick = () => {
  const width = parseInt(inputWidth.value);
  const height = parseInt(inputHeight.value);
  const blockSize = parseInt(inputBlockSize.value);
  const threads = parseInt(inputThreads.value);
  const iterations = parseInt(inputIterations.value);
  const real = parseFloat(inputReal.value);
  const imaginary = parseFloat(inputImaginary.value);
  const zoom = parseFloat(inputZoom.value);

  canvas.width = width;
  canvas.height = height;
  ctx.clearRect(0, 0, width, height);

  const config = {
    width,
    height,
    blockSize,
    threads,
    iterations,
    real,
    imaginary,
    zoom,
  };
  socket.send(JSON.stringify(config));
};

inputZoom.addEventListener("input", () => {
  const zoom = parseFloat(inputZoom.value);
  const baseStep = 0.01;
  const adjustedStep = baseStep / zoom;

  inputReal.step = adjustedStep.toString();
  inputImaginary.step = adjustedStep.toString();
});

document.querySelectorAll(".presets button").forEach((btn) => {
  btn.addEventListener("click", () => {
    const real = btn.getAttribute("data-real");
    const imaginary = btn.getAttribute("data-imaginary");
    const zoom = btn.getAttribute("data-zoom");

    document.getElementById("inputReal").value = real;
    document.getElementById("inputImaginary").value = imaginary;
    document.getElementById("inputZoom").value = zoom;
    document.getElementById("startRender").click();
  });
});

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
  const { xStart, yStart, blockWidth, blockHeight, pixels } = data;
  const imageData = ctx.createImageData(blockWidth, blockHeight);

  for (let i = 0; i < pixels.length; i++) {
    const color = Math.floor(255 * (1 - pixels[i]));
    const base = i * 4;
    imageData.data[base + 0] = color;
    imageData.data[base + 1] = color;
    imageData.data[base + 2] = color;
    imageData.data[base + 3] = 255;
  }

  ctx.putImageData(imageData, xStart, yStart);
}
