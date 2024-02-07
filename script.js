import { drawBricks } from "./components/scripts/UI/drawBricks.js";
import { getElems, setCanvasProperties } from "./components/scripts/UI/setCanvas.js";
import { findBestBrickLayout } from "./components/scripts/logic/findBestBrickLayout.js";

//Class for setting entries easily
class Brick {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }
}

// Entries
const enterBricks = [
  new Brick(500, 500),
  new Brick(200, 200),
  new Brick(300, 250),
  new Brick(100, 100),
  new Brick(70, 70),
  new Brick(70, 70),
  new Brick(60, 50),
  new Brick(60, 50),
  new Brick(512, 64),
];

//UI + Logic
function init() {
  const { app, canvas, ctx, fullnessPlace } = getElems();
  setCanvasProperties(canvas, ctx, app);
  // Main Logic
  let bestBrickLayout = findBestBrickLayout(
    enterBricks,
    canvas.width,
    canvas.height
  );
  fullnessPlace.textContent =
    (bestBrickLayout.countFullness() * 100).toFixed(2) + "%";
  // End of Main Logic
  drawBricks(ctx, bestBrickLayout);
  watchCanvasChanges();
}

const watchCanvasChanges = () => {
  const { app, canvas, ctx, fullnessPlace } = getElems();
  window.addEventListener("resize", () => {
    setCanvasProperties(canvas, ctx, app);
    // Main Logic
    let bestBrickLayout = findBestBrickLayout(
      enterBricks,
      ctx.canvas.width,
      ctx.canvas.height
    );
    fullnessPlace.textContent =
      (bestBrickLayout.countFullness() * 100).toFixed(2) + "%";
    // End of Main Logic
    drawBricks(ctx, bestBrickLayout);
  });
};

init();
