export const generateBricks = () => {
  const bricks = []
  for (let i = 0; i < 3; i++) {
    bricks.push({width: Number((Math.random()*370).toFixed())+20, height: Number((Math.random()*370).toFixed())+20})
  }
  return bricks
}