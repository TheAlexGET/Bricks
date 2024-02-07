//UI
export const getElems = () => {
  const app = document.querySelector(".app");
  //canvas
  const canvas = document.querySelector("#myCanvas");
  const ctx = canvas.getContext("2d");

  const fullnessPlace = document.querySelector("#fullnessPlace");
  return { app, canvas, ctx, fullnessPlace };
};

export const setCanvasProperties = (canvas, ctx, app) => {
  canvas.width = app.clientWidth;
  canvas.height = app.clientHeight * 0.9;
  //color
  ctx.fillStyle = "beige";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};
