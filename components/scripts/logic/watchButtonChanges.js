import { drawBricks } from "../UI/drawBricks.js";
import { getElems, setCanvasProperties } from "../UI/setCanvas.js";
import { findBestBrickLayout } from "./findBestBrickLayout.js";
import { generateBricks } from "./generateBricks.js";


export const watchButtonChanges = (enterBricks) => {
  const { app, canvas, ctx, fullnessPlace, generateBtn} = getElems();
  generateBtn.addEventListener('click', () => {
    setCanvasProperties(canvas, ctx, app);
    // Main Logic
    enterBricks.push(...generateBricks())
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
  })
}