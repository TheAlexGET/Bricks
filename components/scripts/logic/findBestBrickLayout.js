import { Canvas } from "./canvasClass.js";

export function findBestBrickLayout(bricks, canvaWidth, canvaHeight) {
  
  bricks.forEach((brick, index) => {
    brick.initialOrder = brick.initialOrder ?? index;
  });
  bricks.sort((a, b) => b.width - a.width);
  const canvas = new Canvas(canvaWidth, canvaHeight);

  const spaces = [{x: 0, y: 0, width: canvaWidth, height: canvaHeight}]
  for (const brick of bricks) {
    for (let i = spaces.length-1; i >= 0; i--) {
      const space = spaces[i]
      if (brick.width > space.width || brick.height > space.height) continue
      
      //Brick should'nt go beyond canvas
      if (brick.width + space.x > canvaWidth) {
        continue
      }
      if (brick.height + space.y > canvaHeight) {
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
          x: space.x,
          y: space.y + brick.height,
          width: brick.width,
          height: space.height - brick.y
        })
        space.x += brick.width;
        space.width -= brick.width;
      }
      break;
    }
  }
  return canvas;
}