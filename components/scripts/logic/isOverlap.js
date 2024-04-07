//Function from V1 (now is not using)
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