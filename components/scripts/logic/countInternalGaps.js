function countInternalGaps(grid){
  let tempGrid = grid.map(row => row.slice());
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

}