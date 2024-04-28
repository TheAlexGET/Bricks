import { drawBricks } from "../UI/drawBricks.js";
import { getElems, setCanvasProperties } from "../UI/setCanvas.js";
import { findBestBrickLayout } from "./findBestBrickLayout.js";


export const watchCanvasChanges = (enterBricks) => {
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
      console.log(bestBrickLayout.getBricksCount() + ' / ' + enterBricks.length);
    // End of Main Logic
    drawBricks(ctx, bestBrickLayout);
  });
};