import { useEffect, useRef, useState } from 'react';
import './App.css';
// import txt from './inputs/example';
import txt from './inputs/first';

const SQUARE_HEIGHT = 1;

function App() {
  const [positions, setPositions] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [count, setCount] = useState(0);
  const canvas = useRef(null);

  useEffect(() => {
    const lines = txt.split('\n');
    const startPositions = lines.map((line) => {
      const [, x, y] = line.match(/position=<([^,]+),([^>]+)/);
      const [, dx, dy] = line.match(/velocity=<([^,]+),([^>]+)/);
      return { x: +x, y: +y, dx: +dx, dy: +dy };
    });
    setPositions(startPositions);
  }, []);

  const getBounds = () => {
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

    return { leftBound, rightBound, topBound, bottomBound, maxDistance };
  };

  useEffect(() => {
    if (canvas.current) {
      // show top left pixel
      const ctx = canvas.current.getContext('2d');
      const W = ctx.canvas.width,
        H = ctx.canvas.height;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const { maxDistance } = getBounds();
      // canvas height -> 400px -> max 200px either way
      // every time over 200 scale the pixels
      const distanceModulo = Math.floor(maxDistance / (W / 2));
      const scaleFactor = distanceModulo === 0 ? 3 : 1 / (distanceModulo + 1);
      console.log(
        distanceModulo,
        scaleFactor,
        maxDistance / (W / 2),
        maxDistance,
        isRunning
      );

      ctx.setTransform(1, 0, 0, 1, W / 2, H / 2); // moves the origin to the center of
      // the canvas
      if (isRunning && maxDistance > 400) {
        nextCycle();
      } else {
        setIsRunning(false);
      }
    }
  }, [positions]);

  // draw squares on canvas
  positions.forEach((position) => {
    if (!canvas.current) return;
    const ctx = canvas.current.getContext('2d');
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

  const nextCycle = () => {
    setCount((currCount) => currCount + 1);
    setPositions((currPositions) =>
      currPositions.map((pos) => {
        return { ...pos, x: pos.x + pos.dx, y: pos.y + pos.dy };
      })
    );
  };

  const start = () => {
    setIsRunning(true);
  };

  return (
    <div className="App">
      <h1>Logic Blocks</h1>
      <div>
        <button onClick={nextCycle}>Next cycle</button>
        <button onClick={start}>Start</button>
        <span>Count: {count}</span>
      </div>
      <canvas
        ref={canvas}
        height="400px"
        width="400px"
        style={{ border: '1px solid black' }}
      ></canvas>
    </div>
  );
}

export default App;
