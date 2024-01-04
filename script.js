//Logic

// Need a liveserver for this
const enterBricks = [{width: 100, height: 100,}, {width: 100, height: 100,}]

const exitParams = {
  fullness: 1,
  exitBricks: [],
};

function searchPlace(bricks, ctx) {
  const freePlace = {
    left: 0,
    top: ctx.canvas.height,
  };

  let height = ctx.canvas.height;
  for (let i = 0; i < bricks.length; i++) {
    if (i === 0) {
      exitParams.exitBricks.push({
        top: height - bricks[i].height,
        left: 0,
        bottom: 0,
        right: ctx.canvas.width - bricks[0].width,
        initialOrder: 0,
        color: "",
      });
    } else {
      exitParams.exitBricks.push({
        top: height - bricks[i].height - bricks[i-1].height - 40,
        left: 80,
        bottom: 0,
        right: ctx.canvas.width - bricks[i - 1].width,
        initialOrder: i,
        color: "",
      });
    }
  }
}

const countFullness = (enterBricks, exitBricks, ctx) => {
  let fullness = 1;
  let bricksArea =  0
  for (let i = 0; i < exitBricks.length; i++) {
    
  }
  return fullness;
};

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

function drawBricks(exitBricks, enterBricks, ctx) {
  for (let i = 0; i < exitBricks.length; i++) {
    for (let j = 1; j < exitBricks.length; j++) {
      if (
        enterBricks[i].width == enterBricks[j].width &&
        enterBricks[i].height == enterBricks[j].height &&
        !exitBricks.color
      ) {
        exitBricks[i].color
          ? (exitBricks[j].color = exitBricks[i].color)
          : ((ctx.fillStyle = getRandomColor()),
            (exitBricks[i].color = ctx.fillStyle),
            (exitBricks[j].color = ctx.fillStyle));
      }
    }
    exitBricks[i].color
          ? (ctx.fillStyle = exitBricks[i].color)
          : ((ctx.fillStyle = getRandomColor()),
            (exitBricks[i].color = ctx.fillStyle))
    ctx.fillRect(
      exitBricks[i].left,
      exitBricks[i].top,
      enterBricks[i].width,
      enterBricks[i].height
    );
    ctx.fillStyle = "white";
    ctx.fillRect(
      exitParams.exitBricks[i].left + enterBricks[i].width * 0.5 - 15,
      exitParams.exitBricks[i].top + enterBricks[i].height * 0.5 - 15,
      30,
      30
    );
    ctx.font = "25px Arial";
    ctx.fillStyle = "black";
    if (i < 10) {
      ctx.fillText(
        i,
        exitParams.exitBricks[i].left + enterBricks[i].width * 0.5 - 7,
        exitParams.exitBricks[i].top + enterBricks[i].height * 0.5 + 8
      );
    } else {
      ctx.fillText(
        i,
        exitParams.exitBricks[i].left + enterBricks[i].width * 0.5 - 15,
        exitParams.exitBricks[i].top + enterBricks[i].height * 0.5 + 8
      );
    }
  }
}

//UI
// Getting elements
const getElems = () => {
  const app = document.querySelector(".app");
  //canvas
  const c = document.querySelector("#myCanvas");
  const ctx = c.getContext("2d");

  const fullnessPlace = document.querySelector("#fullnessPlace");

  return { app, ctx, fullnessPlace };
};

//Setting canvas properties (Width, Height, ...)
const setCanvasProperies = (ctx, app) => {
  ctx.canvas.width = app.clientWidth;
  ctx.canvas.height = app.clientHeight * 0.9;

  //color
  ctx.fillStyle = "beige";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
};

const watchCanvasChanges = () => {
  const { app, ctx, fullnessPlace } = getElems();
  window.addEventListener("resize", () => {
    setCanvasProperies(ctx, app);
    drawBricks(exitParams.exitBricks, enterBricks, ctx);
  });
};

const init = () => {
  const { app, ctx, fullnessPlace } = getElems();
  setCanvasProperies(ctx, app);
  searchPlace(enterBricks, ctx);
  drawBricks(exitParams.exitBricks, enterBricks, ctx);
  fullnessPlace.textContent = exitParams.fullness * 100 + "%";
  watchCanvasChanges();
  console.log(countFullness(enterBricks, exitParams.exitBricks, ctx));
};

init();
