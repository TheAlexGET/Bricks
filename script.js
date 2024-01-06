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
  new Brick(50, 700),
  new Brick(50, 600),
  new Brick(750, 50),
  new Brick(50, 50),
  new Brick(50, 50),
];

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
          try {
            grid[i][j] = true;
          } catch (e) {
            // nothing
          }
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
  for (let top = 0; top <= canvas.height - brick.height; top++) {
    for (let left = 0; left <= canvas.width - brick.width; left++) {
      if (!isOverlap(canvas, brick, left, top)) {
        return { left, top, rotated: false };
      } else if (
        brick.width !== brick.height &&
        !isOverlap(canvas, brick, left, top, true)
      ) {
        return { left, top, rotated: true };
      }
    }
  }
  return null;
}

function findBestBrickLayout(bricks, canvaWidth, canvaHeight) {
  bricks.sort((a, b) => b.width * b.height - a.width * a.height);
  bricks.forEach((brick, index) => {
    brick.initialOrder = index;
  });

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
  for (const brick of canvas.bricks) {
    brick.color
      ? (ctx.fillStyle = brick.color)
      : ((ctx.fillStyle = getRandomColor()), (brick.color = ctx.fillStyle));
    ctx.fillRect(brick.left, brick.top, brick.width, brick.height);

    if (brick.initialOrder >= 0) {
      ctx.fillStyle = "white";
      ctx.fillRect(
        brick.left + brick.width / 2 - 12.5,
        brick.top + brick.height / 2 - 12.5,
        25,
        25
      );
      ctx.save()
      ctx.translate(brick.left + brick.width / 2 + 10, brick.top + brick.height / 2 - 7)
      ctx.rotate(Math.PI);
      ctx.fillStyle = "black";
      ctx.font = "20px Arial";
      ctx.fillText(brick.initialOrder, 0, 0);
      ctx.restore()
    }

    // else {
    //   brick.color
    //     ? (ctx.fillStyle = brick.color)
    //     : ((ctx.fillStyle = getRandomColor()), (brick.color = ctx.fillStyle));
    //   ctx.fillRect(brick.left, brick.top, brick.width, brick.height);
    // }
  }
}

//UI
// Getting elements
const getElems = () => {
  const app = document.querySelector(".app");
  //canvas
  const c = document.querySelector("#myCanvas");
  const ctx = c.getContext("2d");

  const fullnessPlace = document.querySelector("#fullnessPlace");
  return { app, ctx, fullnessPlace };
};

//Setting canvas properties (Width, Height, ...)
const setCanvasProperies = (ctx, app) => {
  ctx.canvas.width = app.clientWidth;
  ctx.canvas.height = app.clientHeight * 0.9;
  //color
  ctx.fillStyle = "beige";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
};

function init() {
  const { app, ctx, fullnessPlace } = getElems();
  setCanvasProperies(ctx, app);
  let bestBrickLayout = findBestBrickLayout(
    enterBricks,
    ctx.canvas.width,
    ctx.canvas.height
  );

  fullnessPlace.textContent =
    (bestBrickLayout.countFullness() * 100).toFixed(2) + "%";
  drawBricks(ctx, bestBrickLayout);
}

init();

window.addEventListener("resize", init);
