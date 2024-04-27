const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export function drawBricks(ctx, canvas) {
  const dimensionColorMap = {};
  for (const brick of canvas.bricks) {
    const dimensionKey = `${brick.width}_${brick.height}`;
    brick.color = dimensionColorMap[dimensionKey] || getRandomColor();
    dimensionColorMap[dimensionKey] = brick.color;

    ctx.fillStyle = brick.color;
    ctx.fillRect(brick.left, brick.top, brick.width, brick.height);

    if (brick.initialOrder >= 0) {
      //White rectangle for number
      ctx.fillStyle = "white";
      ctx.fillRect(
        brick.left + brick.width / 2 - 12.5,
        brick.top + brick.height / 2 - 12.5,
        25,
        25
      );
      ctx.save();
      ctx.translate(
        brick.left + brick.width / 2 + 11, //number x-cord from right to left when adding
        brick.top + brick.height / 2 - 5 // number y-cord from top to bottom when decreasing
      );
      ctx.rotate(Math.PI);
      ctx.fillStyle = "black";
      ctx.font = "14px Arial";
      ctx.fillText(brick.initialOrder, 0, 0);
      ctx.restore();
    }
  }
}
