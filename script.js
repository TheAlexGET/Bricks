// There is one non-critical bug that is caused from bad optimization
// The main algorithm is working
// I would appreciate the feedback

class Brick {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }
}

// Entries
// For Json input need server but in condition is to use client side
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

// JSON Entries With server only, add (enterBricks.length ?enterBricks :await getBricks()) in init()
// let enterBricks = []
// async function getBricks(){
//   const response = await fetch("bricks.json")
//   .then(response => response.json())
//   .then(json => enterBricks.push(...json.bricks))
//   return
// }

//Logic
class Canvas {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.bricks = [
      { left: 0, top: 0, width: 1, height: this.height, color: "#6185f8" },
      {
        left: this.width - 1,
        top: 0,
        width: 1,
        height: this.height,
        color: "#6185f8",
      },
    ];
    this.internalGaps = 0;
  }

  addBrick(brick, left, top, rotated = false) {
    if (rotated) {
      [brick.width, brick.height] = [brick.height, brick.width];
    }
    this.bricks.push({ ...brick, left, top, rotated });
    this.updateInternalGaps();
  }

  countFullness() {
    const brickArea = this.bricks.reduce(
      (area, brick) => (area += brick.width * brick.height),
      0
    );
    const fullness = 1 - this.internalGaps / (this.internalGaps + brickArea);
    return fullness;
  }

  updateInternalGaps() {
    const grid = Array.from({ length: this.height }, () =>
      Array(this.width).fill(false)
    );

    for (const brick of this.bricks) {
      for (let i = brick.top; i < brick.top + brick.height; i++) {
        for (let j = brick.left; j < brick.left + brick.width; j++) {
          grid[i][j] = true;
        }
      }
    }

    this.internalGaps = 0;
    grid.reverse();
    for (let i = 1; i < this.height - 1; i++) {
      for (let j = 1; j < this.width - 1; j++) {
        if (!grid[i][j] && grid[i][j - 1] && grid[i - 1][j]) {
          let startPos = j;
          let endPos = j;
          while (grid[i - 1][endPos] && !grid[i][endPos]) {
            if (
              (!grid[i - 1][endPos + 1] && grid[i][endPos + 1]) ||
              (grid[i - 1][endPos + 1] && grid[i][endPos + 1])
            ) {
              this.internalGaps += endPos + 1 - startPos;
              grid[i].fill(true, startPos, endPos + 1);
            }
            endPos += 1;
          }
        }
      }
    }
  }
}

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

  for (let i = top; i < top + checkBrick.height; i++) {
    for (let j = left; j < left + checkBrick.width; j++) {
      grid[i][j] = true;
    }
  }

  let internalGaps = 0;
  grid.reverse();
  for (let i = 1; i < canvas.height - 1; i++) {
    for (let j = 1; j < canvas.width - 1; j++) {
      if (!grid[i][j] && grid[i][j - 1] && grid[i - 1][j]) {
        let startPos = j;
        let endPos = j;
        while (grid[i - 1][endPos] && !grid[i][endPos]) {
          if (
            (!grid[i - 1][endPos + 1] && grid[i][endPos + 1]) ||
            (grid[i - 1][endPos + 1] && grid[i][endPos + 1])
          ) {
            internalGaps += endPos + 1 - startPos;
            grid[i].fill(true, startPos, endPos + 1);
          }
          endPos += 1;
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

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

function drawBricks(ctx, canvas) {
  const dimensionColorMap = {};
  for (const brick of canvas.bricks) {
    const dimensionKey = `${brick.width}_${brick.height}`;
    brick.color = dimensionColorMap[dimensionKey] || getRandomColor();
    dimensionColorMap[dimensionKey] = brick.color;

    ctx.fillStyle = brick.color;
    ctx.fillRect(brick.left, brick.top, brick.width, brick.height);

    if (brick.initialOrder >= 0) {
      ctx.fillStyle = "white";
      ctx.fillRect(
        brick.left + brick.width / 2 - 12.5,
        brick.top + brick.height / 2 - 12.5,
        25,
        25
      );
      ctx.save();
      ctx.translate(
        brick.left + brick.width / 2 + 10,
        brick.top + brick.height / 2 - 7
      );
      ctx.rotate(Math.PI);
      ctx.fillStyle = "black";
      ctx.font = "20px Arial";
      ctx.fillText(brick.initialOrder, 0, 0);
      ctx.restore();
    }
  }
}

//UI
// Getting elements
const getElems = () => {
  const app = document.querySelector(".app");
  //canvas
  const canvas = document.querySelector("#myCanvas");
  const ctx = canvas.getContext("2d");

  const fullnessPlace = document.querySelector("#fullnessPlace");
  return { app, canvas, ctx, fullnessPlace };
};

//Setting canvas properties (Width, Height, ...)
const setCanvasProperties = (canvas, ctx, app) => {
  canvas.width = app.clientWidth;
  canvas.height = app.clientHeight * 0.9;
  //color
  ctx.fillStyle = "beige";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

const watchCanvasChanges = () => {
  const { app, canvas, ctx, fullnessPlace } = getElems();
  window.addEventListener("resize", () => {
    setCanvasProperties(canvas, ctx, app);
    let bestBrickLayout = findBestBrickLayout(
      enterBricks,
      ctx.canvas.width,
      ctx.canvas.height
    );
    fullnessPlace.textContent =
      (bestBrickLayout.countFullness() * 100).toFixed(2) + "%";
    drawBricks(ctx, bestBrickLayout);
  });
};

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
