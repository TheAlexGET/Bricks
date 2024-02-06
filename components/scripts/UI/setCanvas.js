//UI

const getElems = () => {
  const app = document.querySelector(".app");
  //canvas
  const canvas = document.querySelector("#myCanvas");
  const ctx = canvas.getContext("2d");

  const fullnessPlace = document.querySelector("#fullnessPlace");
  return { app, canvas, ctx, fullnessPlace };
};

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
