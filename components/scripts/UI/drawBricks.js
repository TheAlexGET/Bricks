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
