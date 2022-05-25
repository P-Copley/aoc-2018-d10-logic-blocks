const SQUARE_HEIGHT = 1;
const canvas = document.querySelector('canvas');
const countTag = document.querySelector('#count');
const ctx = canvas.getContext('2d');
let isRunning = false;
let count = 0;

// work out start positions
const lines = txt.split('\n');
const positions = lines.map((line) => {
  const [, x, y] = line.match(/position=<([^,]+),([^>]+)/);
  const [, dx, dy] = line.match(/velocity=<([^,]+),([^>]+)/);
  return { x: +x, y: +y, dx: +dx, dy: +dy };
});

function cyclePositions() {
  // show top left pixel
  const W = ctx.canvas.width;
  const H = ctx.canvas.height;
  // clear canvas
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, W, H);

  const xPositions = positions.map(({ x }) => x);
  const yPositions = positions.map(({ y }) => y);
  const leftBound = Math.min(...xPositions, 0);
  const rightBound = Math.max(...xPositions, 0);
  const topBound = Math.max(...yPositions, 0);

  const bottomBound = Math.max(...yPositions, 0);
  const maxDistance = Math.max(
    Math.abs(leftBound),
    Math.abs(rightBound),
    Math.abs(topBound),
    Math.abs(bottomBound)
  );
  // canvas height -> 600px -> max 300px either way
  // every time over 300 scale the pixels
  const distanceModulo = Math.floor(maxDistance / (W / 2));
  const scaleFactor = distanceModulo === 0 ? 3 : 1 / (distanceModulo + 1);
  console.log({ maxDistance });

  // move 0,0 to the center of the canvas
  // TODO update this to focus on a word not near the center
  ctx.setTransform(1, 0, 0, 1, W / 2, H / 2);
  drawPixels();
  // the canvas
  if (isRunning && maxDistance > 400) {
    // set timeout to avoid blowing the stack
    setTimeout(() => {
      nextCycle();
    }, 0);
  } else {
    isRunning = false;
  }
}

function drawPixels() {
  positions.forEach((position) => {
    ctx.beginPath();
    ctx.lineWidth = '1';
    ctx.strokeStyle = 'black';
    ctx.rect(
      position.x * SQUARE_HEIGHT,
      position.y * SQUARE_HEIGHT,
      SQUARE_HEIGHT,
      SQUARE_HEIGHT
    );
    ctx.stroke();
    ctx.fill();
  });
}

const nextCycle = () => {
  count++;
  countTag.innerText = `Count: ${count}`;
  positions.forEach((pos) => {
    pos.x += pos.dx;
    pos.y += pos.dy;
  });
  cyclePositions();
};

function start() {
  isRunning = true;
  cyclePositions();
}

// drawPixels();
cyclePositions();
