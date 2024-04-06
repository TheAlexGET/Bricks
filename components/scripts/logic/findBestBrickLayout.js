import { calculateUtilization } from "./calculateUtilization.js";
import { Canvas } from "./canvasClass.js";
import { isOverlap } from "./isOverlap.js";

export function findBestBrickLayout(bricks, canvaWidth, canvaHeight) {
  bricks.forEach((brick, index) => {
    brick.initialOrder = brick.initialOrder ?? index;
  });
  bricks.sort((a, b) => b.height - a.height);

  const canvas = new Canvas(canvaWidth, canvaHeight);

  for (const brick of bricks) {
    const bestPlace = findBestPlace(canvas, brick);

    if (bestPlace) {
      canvas.addBrick(brick, bestPlace.left, bestPlace.top, bestPlace.rotated);
    }
  }
  return canvas;
}

export function findBestPlace(canvas, brick) {
  let bestFit = null;
  let bestUtilization = 0;
  for (let top = 0; top < canvas.height - brick.height; top++) { //if brick doesnt exit otside canvas
    for (let left = 0; left < canvas.width - brick.width; left++) {
      if (!isOverlap(canvas, brick, left, top, false)) {
        const nonRotatedUtilization = calculateUtilization(
          canvas,
          brick,
          left,
          top,
          false
        );
        if (nonRotatedUtilization == 1) {
          return { left, top, rotated: false };
        }
        if (nonRotatedUtilization > bestUtilization) {
          bestUtilization = nonRotatedUtilization;
          bestFit = { left, top, rotated: false };
        }
      }
    }
  }
  if(bestFit == null || bestUtilization < 1){
    for (let top = 0; top <= canvas.height - brick.width - 1; top++) {
      for (let left = 0; left <= canvas.width - brick.height - 1; left++) {
        if (
          brick.width !== brick.height &&
          !isOverlap(canvas, brick, left, top, true)
        ) {
          const rotatedUtilization = calculateUtilization(
            canvas,
            brick,
            left,
            top,
            true
          );
          if (rotatedUtilization == 1) {
            return { left, top, rotated: true };
          }
          if (rotatedUtilization > bestUtilization) {
            bestUtilization = rotatedUtilization;
            bestFit = { left, top, rotated: true };
          }
        }
      }
    }
  }
  return bestFit;
}