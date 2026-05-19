import { useState, useEffect, useCallback } from 'react';

export type Point = { x: number; y: number };

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const INITIAL_SPEED = 150;

export function useSnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [nextDirection, setNextDirection] = useState<Point>(INITIAL_DIRECTION); // prevents rapid double-turn suicide
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Ensure food doesn't spawn on the snake
      const isOnSnake = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setNextDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setFood(generateFood(INITIAL_SNAKE));
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ') {
        setIsPaused((p) => !p);
        return;
      }

      setNextDirection((prevNextDir) => {
        switch (e.key) {
          case 'ArrowUp':
          case 'w':
            if (direction.y === 1) return prevNextDir;
            return { x: 0, y: -1 };
          case 'ArrowDown':
          case 's':
            if (direction.y === -1) return prevNextDir;
            return { x: 0, y: 1 };
          case 'ArrowLeft':
          case 'a':
            if (direction.x === 1) return prevNextDir;
            return { x: -1, y: 0 };
          case 'ArrowRight':
          case 'd':
            if (direction.x === -1) return prevNextDir;
            return { x: 1, y: 0 };
          default:
            return prevNextDir;
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const currentDir = nextDirection;
        setDirection(currentDir); // Commit the direction we actually moved

        const newHead = {
          x: prevSnake[0].x + currentDir.x,
          y: prevSnake[0].y + currentDir.y,
        };

        // Check wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Check self collision
        if (
          prevSnake.some(
            (segment) => segment.x === newHead.x && segment.y === newHead.y
          )
        ) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop(); // Remove tail if we didn't eat
        }

        return newSnake;
      });
    };

    const speed = Math.max(50, INITIAL_SPEED - Math.floor(score / 30) * 10);
    const intervalId = setInterval(moveSnake, speed);
    return () => clearInterval(intervalId);
  }, [nextDirection, gameOver, food, score, generateFood, isPaused]);

  return { snake, food, score, gameOver, isPaused, resetGame, gridSize: GRID_SIZE };
}
