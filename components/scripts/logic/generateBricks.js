import { getElems } from "../UI/setCanvas.js"

export const generateBricks = () => {
  const {canvas} = getElems()
  const maxWidth = canvas.width * 0.2
  const maxHeight = canvas.height * 0.2
  const bricks = []
  for (let i = 0; i < 10; i++) {
    bricks.push({width: Number((Math.random()*maxWidth).toFixed())+25, height: Number((Math.random()*maxHeight).toFixed())+25})
  }
  return bricks
}