export function calculateUtilization(canvas, brick, left, top, rotated = false) {
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