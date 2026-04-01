import React, { useEffect, useMemo, useState } from 'react';
import GameHelpModal from '../components/GameHelpModal';
import GameRating from '../components/GameRating';
import { getGameHelp, loadGameState, saveGameState, submitScore } from '../utils/gameStorage';

const SIZE = 12;
const initialSnake = [{ x: 2, y: 2 }];
const initialFood = { x: 7, y: 7 };

export default function SnakeGame() {
  const [snake, setSnake] = useState(initialSnake);
  const [direction, setDirection] = useState('RIGHT');
  const [food, setFood] = useState(initialFood);
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [helpOpen, setHelpOpen] = useState(false);
  const [helpText, setHelpText] = useState('');
  const [startTime] = useState(Date.now());

  useEffect(() => {
    getGameHelp('snake').then((res) => setHelpText(res.data.instructions || ''));
  }, []);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'ArrowUp' && direction !== 'DOWN') setDirection('UP');
      if (e.key === 'ArrowDown' && direction !== 'UP') setDirection('DOWN');
      if (e.key === 'ArrowLeft' && direction !== 'RIGHT') setDirection('LEFT');
      if (e.key === 'ArrowRight' && direction !== 'LEFT') setDirection('RIGHT');
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [direction]);

  useEffect(() => {
    if (!running || gameOver) return;

    const timer = setInterval(() => {
      setSnake((prev) => {
        const head = { ...prev[0] };
        if (direction === 'UP') head.y -= 1;
        if (direction === 'DOWN') head.y += 1;
        if (direction === 'LEFT') head.x -= 1;
        if (direction === 'RIGHT') head.x += 1;

        if (
          head.x < 0 || head.y < 0 || head.x >= SIZE || head.y >= SIZE ||
          prev.some((part) => part.x === head.x && part.y === head.y)
        ) {
          setGameOver(true);
          setRunning(false);
          submitScore('snake', score, Math.floor((Date.now() - startTime) / 1000)).catch(console.error);
          return prev;
        }

        const ateFood = head.x === food.x && head.y === food.y;
        const next = [head, ...prev];
        if (!ateFood) next.pop();

        if (ateFood) {
          setScore((s) => s + 10);
          setFood({
            x: Math.floor(Math.random() * SIZE),
            y: Math.floor(Math.random() * SIZE),
          });
        }

        return next;
      });
    }, 250);

    return () => clearInterval(timer);
  }, [running, direction, food, gameOver, score]);

  const cells = useMemo(() => {
    const items = [];
    for (let y = 0; y < SIZE; y++) {
      for (let x = 0; x < SIZE; x++) {
        const isSnake = snake.some((s) => s.x === x && s.y === y);
        const isFood = food.x === x && food.y === y;
        items.push({ x, y, isSnake, isFood });
      }
    }
    return items;
  }, [snake, food]);

  const handleSave = async () => {
    await saveGameState('snake', { boardState: { snake, direction, food, score }, isPlayerTurn: true });
    alert('Đã lưu snake');
  };

  const handleLoad = async () => {
    const data = await loadGameState('snake');
    const parsed = typeof data.state_data === 'string' ? JSON.parse(data.state_data) : data.state_data;
    const state = parsed.boardState || parsed.board || {};
    if (state.snake) setSnake(state.snake);
    if (state.direction) setDirection(state.direction);
    if (state.food) setFood(state.food);
    if (typeof state.score === 'number') setScore(state.score);
  };

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <h1>Snake Game</h1>
      <p>Điểm: {score}</p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button onClick={() => setRunning((v) => !v)}>{running ? 'Pause' : 'Start'}</button>
        <button onClick={handleSave}>Save</button>
        <button onClick={handleLoad}>Load</button>
        <button onClick={() => setHelpOpen(true)}>Help</button>
      </div>

      <div style={grid}>
        {cells.map((cell) => (
          <div
            key={`${cell.x}-${cell.y}`}
            style={{
              width: 28,
              height: 28,
              border: '1px solid #ddd',
              background: cell.isSnake ? 'green' : cell.isFood ? 'red' : '#fff',
            }}
          />
        ))}
      </div>

      {gameOver && <h2>Game Over</h2>}

      <GameHelpModal open={helpOpen} onClose={() => setHelpOpen(false)} content={helpText} />
      <GameRating gameSlug="snake" />
    </div>
  );
}

const grid = {
  display: 'grid',
  gridTemplateColumns: `repeat(${SIZE}, 28px)`,
  gap: 2,
};