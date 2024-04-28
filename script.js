import { drawBricks } from "./components/scripts/UI/drawBricks.js";
import { getElems, setCanvasProperties } from "./components/scripts/UI/setCanvas.js";
import { findBestBrickLayout } from "./components/scripts/logic/findBestBrickLayout.js";
import { watchButtonChanges } from "./components/scripts/logic/watchButtonChanges.js";
import { watchCanvasChanges } from "./components/scripts/logic/watchCanvasChanges.js";

//Class for setting entries easily
class Brick {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }
}

// Entries
const enterBricks = [
  new Brick(200, 200),
  new Brick(300, 250),
  new Brick(100, 100),
  new Brick(70, 70),
  new Brick(70, 70),
  new Brick(60, 50),
  new Brick(60, 50),
];

//UI + Logic
function init() {
  const { app, canvas, ctx, fullnessPlace, packedPlace} = getElems();
  setCanvasProperties(canvas, ctx, app);
  // Main Logic
  let bestBrickLayout = findBestBrickLayout(
    enterBricks,
    canvas.width,
    canvas.height
  );
  fullnessPlace.textContent =
    (bestBrickLayout.countFullness() * 100).toFixed(2) + "%";
  packedPlace.textContent = (bestBrickLayout.getBricksCount() + '/' + enterBricks.length);
  // End of Main Logic
  drawBricks(ctx, bestBrickLayout);
  watchCanvasChanges(enterBricks);
  watchButtonChanges(enterBricks);
}

init();
