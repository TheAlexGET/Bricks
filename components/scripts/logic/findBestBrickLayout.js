import { Canvas } from "./canvasClass.js";

export function findBestBrickLayout(bricks, canvaWidth, canvaHeight) {
  let area = 0;
  let maxWidth = 0;

  bricks.forEach((brick, index) => {
    area += brick.width * brick.height
    maxWidth = Math.max(maxWidth, brick.width)
    brick.initialOrder = brick.initialOrder ?? index;
  });
  bricks.sort((a, b) => b.height - a.height);

  const canvas = new Canvas(canvaWidth, canvaHeight);

  const spaces = [{x: 0, y: 0, width: canvaWidth, height: canvaHeight}]
  for (const brick of bricks) {
    for (let i = spaces.length-1; i >= 0; i--) {
      const space = spaces[i]
      if (brick.width > space.width || brick.height > space.height) continue
      
      if (brick.width + space.x > canvaWidth-3) {
        continue
      }
      canvas.addBrick(brick, space.x, space.y)

      if (brick.width === space.width && brick.height === space.height) {
        const last = spaces.pop()
        if (i < spaces.length) {
          spaces[i] = last
        }
      } else if (brick.height === space.height) {
          space.x += brick.width
          space.w -= brick.width
      } else if (brick.width === space.width) {
        space.y += brick.height
        space.height -= brick.height
      } else{
        spaces.push({
          x: space.x + brick.width,
          y: space.y,
          width: space.width - brick.width,
          height: brick.height
        })
        space.y += brick.height;
        space.height -= brick.height;
      }
      break;
    }
  }
  return canvas;
}