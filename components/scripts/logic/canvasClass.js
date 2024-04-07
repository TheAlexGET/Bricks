export class Canvas {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.bricks = [];
    this.internalGaps = 0;
  }

  addBrick(brick, left, top, rotated = false) {
    if (rotated) {
      [brick.width, brick.height] = [brick.height, brick.width];
    }
    this.bricks.push({ ...brick, left, top, rotated });
  }

  countFullness() {
    if (!this.bricks.length) {
      return 0
    }
    this.updateInternalGaps();
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
    let tempGrid = grid.map(row => row.slice());

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
              this.internalGaps += startPos - endPos + 1;
              tempGrid[i].fill(true, endPos, startPos + 1);
            }
            endPos -= 1;
          }
        }
      }
    }
  }
}