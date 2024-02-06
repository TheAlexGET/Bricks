//Class for setting entries easily
class Brick {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }
}

// Entries
const enterBricks = [
  { width: 500, height: 500 },
  { width: 200, height: 200 },
  { width: 300, height: 250 },
  { width: 100, height: 100 },
  { width: 70, height: 70 },
  { width: 70, height: 70 },
  { width: 50, height: 700 },
  { width: 50, height: 600 },
  { width: 750, height: 50 },
  { width: 50, height: 50 },
  { width: 50, height: 50 },
  { width: 512, height: 50 },
];

//Logic

function isOverlap(canvas, brick, left, top, rotated = false) {
  const checkBrick = rotated
    ? { width: brick.height, height: brick.width }
    : brick;
  for (const placedBrick of canvas.bricks) {
    if (
      left < placedBrick.left + placedBrick.width &&
      left + checkBrick.width > placedBrick.left &&
      top < placedBrick.top + placedBrick.height &&
      top + checkBrick.height > placedBrick.top
    ) {
      return true;
    }
  }
  return false;
}

function findBestPlace(canvas, brick) {
  let bestFit = null;
  let bestUtilization = 0;
  for (let top = 0; top <= canvas.height - brick.height - 1; top++) {
    for (let left = 0; left <= canvas.width - brick.width - 1; left++) {
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

function calculateUtilization(canvas, brick, left, top, rotated = false) {
  const checkBrick = rotated
    ? { width: brick.height, height: brick.width }
    : brick;

  const grid = Array.from({ length: canvas.height }, () =>
    Array(canvas.width).fill(false)
  );

  for (const placedBrick of canvas.bricks) {
    for (
      let i = placedBrick.top;
      i < placedBrick.top + placedBrick.height;
      i++
    ) {
      for (
        let j = placedBrick.left;
        j < placedBrick.left + placedBrick.width;
        j++
      ) {
        grid[i][j] = true;
      }
    }
  }

  let tempGrid = grid.map(row => row.slice());

  for (let i = top; i < top + checkBrick.height; i++) {
    for (let j = left; j < left + checkBrick.width; j++) {
      tempGrid[i][j] = true;
    }
  }

  let internalGaps = 0;

  for (let i = tempGrid.length-2; i >= 0; i--) { // minus 2 to start from pre last row
    for (let j = tempGrid[i].length; j >= 0; j--) {
      if (
        (!tempGrid[i][j] && tempGrid[i][j + 1] && tempGrid[i + 1][j]) ||
        (!tempGrid[i][j] &&
          tempGrid[i][j + 1] === undefined &&
          tempGrid[i + 1][j])
      ) {
        let startPos = j;
        let endPos = j;
        while (tempGrid[i + 1][endPos] && !tempGrid[i][endPos]) {
          if (
            (!tempGrid[i + 1][endPos - 1] && tempGrid[i][endPos - 1]) ||
            (tempGrid[i + 1][endPos - 1] && tempGrid[i][endPos - 1]) ||
            (tempGrid[i + 1][endPos - 1] === undefined &&
              tempGrid[i][endPos - 1] === undefined)
          ) {
            internalGaps += startPos - endPos + 1;
            tempGrid[i].fill(true, endPos, startPos + 1);
          }
          endPos -= 1;
        }
      }
    }
  }

  const brickArea = canvas.bricks.reduce(
    (area, placedBrick) => area + placedBrick.width * placedBrick.height,
    brick.width * brick.height
  );
  const fullness = 1 - internalGaps / (internalGaps + brickArea);
  return fullness;
}

function findBestBrickLayout(bricks, canvaWidth, canvaHeight) {
  bricks.forEach((brick, index) => {
    brick.initialOrder = brick.initialOrder ?? index;
  });
  bricks.sort((a, b) => b.width * b.height - a.width * a.height);

  const canvas = new Canvas(canvaWidth, canvaHeight);

  for (const brick of bricks) {
    const bestPlace = findBestPlace(canvas, brick);

    if (bestPlace) {
      canvas.addBrick(brick, bestPlace.left, bestPlace.top, bestPlace.rotated);
    }
  }
  return canvas;
}

//UI
async function init() {
  const { app, canvas, ctx, fullnessPlace } = getElems();
  setCanvasProperties(canvas, ctx, app);
  let bestBrickLayout = findBestBrickLayout(
    enterBricks,
    canvas.width,
    canvas.height
  );
  fullnessPlace.textContent =
    (bestBrickLayout.countFullness() * 100).toFixed(2) + "%";
  drawBricks(ctx, bestBrickLayout);
  watchCanvasChanges();
}
init();
