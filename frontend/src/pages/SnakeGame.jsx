import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import GameHelpModal from '../components/GameHelpModal';
import GameRating from '../components/GameRating';
import { getGameHelp, loadGameState, saveGameState, submitScore } from '../utils/gameStorage';

const SIZE = 12;
const initialSnake = [{ x: 2, y: 2 }];
const initialFood = { x: 7, y: 7 };

const hasPath = (start, target, snakeBody, obstacles) => {
  const queue = [start];
  const visited = new Set();
  visited.add(`${start.x},${start.y}`);

  const isBlocked = (x, y) => {
    if (x < 0 || y < 0 || x >= SIZE || y >= SIZE) return true;
    if (snakeBody.some((s) => s.x === x && s.y === y)) return true;
    if (obstacles.some((o) => o.x === x && o.y === y)) return true;
    return false;
  };

  while (queue.length > 0) {
    const { x, y } = queue.shift();
    if (x === target.x && y === target.y) return true;

    const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    for (const [dx, dy] of dirs) {
      const nx = x + dx;
      const ny = y + dy;
      const key = `${nx},${ny}`;

      if (!visited.has(key) && !isBlocked(nx, ny)) {
        visited.add(key);
        queue.push({ x: nx, y: ny });
      }
    }
  }
  return false;
};

const getSafeFood = (snakeBody, obsList) => {
  const emptyCells = [];
  for (let x = 0; x < SIZE; x++) {
    for (let y = 0; y < SIZE; y++) {
      if (
        !snakeBody.some((s) => s.x === x && s.y === y) &&
        !obsList.some((o) => o.x === x && o.y === y)
      ) {
        emptyCells.push({ x, y });
      }
    }
  }
  if (emptyCells.length === 0) return null;

  emptyCells.sort(() => Math.random() - 0.5);

  for (let cell of emptyCells) {
    if (hasPath(snakeBody[0], cell, snakeBody, obsList)) {
      return cell;
    }
  }
  return emptyCells[0];
};

const generateBlockObstacles = (snakeBody) => {
  const tempObs = [];
  const numObs = Math.floor(Math.random() * 2) + 3; 
  let blocksPlaced = 0;
  let tries = 0;
  const head = snakeBody[0];

  while (blocksPlaced < numObs && tries < 50) {
    tries++;
    const size = Math.floor(Math.random() * 2) + 2; 
    const ox = Math.floor(Math.random() * (SIZE - size + 1));
    const oy = Math.floor(Math.random() * (SIZE - size + 1));

    let overlap = false;

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const bx = ox + c;
        const by = oy + r;

        if (snakeBody.some(s => s.x === bx && s.y === by)) overlap = true;
        if (tempObs.some(o => o.x === bx && o.y === by)) overlap = true;
        
        if (Math.max(Math.abs(bx - head.x), Math.abs(by - head.y)) <= 2) {
          overlap = true;
        }
      }
    }

    if (!overlap) {
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          tempObs.push({ x: ox + c, y: oy + r });
        }
      }
      blocksPlaced++;
    }
  }
  return tempObs;
};

export default function SnakeGame() {
  const navigate = useNavigate();

  const [difficulty, setDifficulty] = useState('EASY');
  const [obstacles, setObstacles] = useState([]);
  const [snake, setSnake] = useState(initialSnake);
  const [direction, setDirection] = useState('RIGHT');
  const [food, setFood] = useState(initialFood);
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [helpOpen, setHelpOpen] = useState(false);
  const [helpText, setHelpText] = useState('');
  const [startTime, setStartTime] = useState(Date.now());

  const directionRef = useRef(direction);

  useEffect(() => {
    getGameHelp('snake').then((res) => setHelpText(res.data.instructions || ''));
  }, []);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      const currentDir = directionRef.current;
      if (e.key === 'ArrowUp' && currentDir !== 'DOWN') setDirection('UP');
      if (e.key === 'ArrowDown' && currentDir !== 'UP') setDirection('DOWN');
      if (e.key === 'ArrowLeft' && currentDir !== 'RIGHT') setDirection('LEFT');
      if (e.key === 'ArrowRight' && currentDir !== 'LEFT') setDirection('RIGHT');
      
      if (e.key === ' ' && !gameOver) {
        setRunning(r => !r);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [gameOver]);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  const resetGame = (newDifficulty = difficulty) => {
    setDifficulty(newDifficulty);
    setSnake(initialSnake);
    setDirection('RIGHT');
    setScore(0);
    setGameOver(false);
    setStartTime(Date.now());
    
    if (newDifficulty === 'HARD') {
      let valid = false;
      let attempts = 0;
      let obs = [];
      let fd = null;
      
      while (!valid && attempts < 30) {
        attempts++;
        obs = generateBlockObstacles(initialSnake);
        fd = getSafeFood(initialSnake, obs);
        if (fd) valid = true;
      }
      
      if (valid) {
        setObstacles(obs);
        setFood(fd);
      } else {
        setObstacles([]);
        setFood(initialFood);
      }
    } else {
      setObstacles([]);
      setFood(getSafeFood(initialSnake, []));
    }
  };

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
          prev.some((part) => part.x === head.x && part.y === head.y) ||
          obstacles.some((o) => o.x === head.x && o.y === head.y)
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
          
          if (difficulty === 'HARD') {
            let valid = false;
            let attempts = 0;
            let nextObs = [];
            let nextFood = null;

            while (!valid && attempts < 30) {
              attempts++;
              nextObs = generateBlockObstacles(next); 
              nextFood = getSafeFood(next, nextObs);  
              if (nextFood) valid = true;
            }

            if (valid) {
              setObstacles(nextObs); 
              setFood(nextFood);     
            } else {
              setObstacles([]);
              setFood(getSafeFood(next, []));
            }
          } else {
            const nextFood = getSafeFood(next, []);
            if (nextFood) {
               setFood(nextFood);
            } else {
               setGameOver(true);
               setRunning(false);
               alert("Thắng game!");
            }
          }
        }

        return next;
      });
    }, 250);

    return () => clearInterval(timer);
  }, [running, direction, food, gameOver, score, obstacles, startTime, difficulty]);

  const cells = useMemo(() => {
    const items = [];
    const head = snake[0];
    const bodyParts = snake.slice(1);

    for (let y = 0; y < SIZE; y++) {
      for (let x = 0; x < SIZE; x++) {
        const isSnakeHead = head && x === head.x && y === head.y;
        const isSnakeBody = bodyParts.some((part) => part.x === x && part.y === y);
        const isFood = food.x === x && food.y === y;
        const isObstacle = obstacles.some((o) => o.x === x && o.y === y);
        
        items.push({ x, y, isSnakeHead, isSnakeBody, isFood, isObstacle });
      }
    }
    return items;
  }, [snake, food, obstacles]);

  const handleSave = async () => {
    await saveGameState('snake', { 
      boardState: { snake, direction, food, score, difficulty, obstacles }, 
      isPlayerTurn: true 
    });
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
    if (state.difficulty) setDifficulty(state.difficulty);
    if (state.obstacles) setObstacles(state.obstacles);
  };

  function toolbarBtn(bg, color = 'white') {
    return {
      padding: '10px 18px',
      background: bg,
      color,
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: 'bold',
    };
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '40px', color: 'var(--text-main)', padding: '0 16px 40px' }}>
      <h1 style={{ color: '#40c057', fontSize: '36px', letterSpacing: '2px', textTransform: 'uppercase' }}>
        🐍 Snake Game 🍎
      </h1>
      
      <p style={{ fontSize: '20px', fontWeight: 'bold', margin: '15px 0', color: gameOver ? '#fa5252' : 'inherit' }}>
        {gameOver ? "💀 Game Over!" : `Điểm: ${score}`}
      </p>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button 
          onClick={() => resetGame(difficulty === 'EASY' ? 'HARD' : 'EASY')} 
          style={toolbarBtn(difficulty === 'EASY' ? '#339af0' : '#fa5252')}
        >
          ⚙️ Khó: {difficulty === 'EASY' ? 'DỄ' : 'KHÓ'}
        </button>

        <button onClick={() => setRunning((v) => !v)} style={toolbarBtn(running ? '#fcc419' : '#40c057', running ? '#111' : 'white')}>
          {running ? '⏸Pause' : '▶Start (Space)'}
        </button>
        <button onClick={() => resetGame(difficulty)} style={toolbarBtn('#845ef7')}>🔄 Chơi lại</button>
        <button onClick={handleSave} style={toolbarBtn('#40c057')}>💾 Save</button>
        <button onClick={handleLoad} style={toolbarBtn('#845ef7')}>📂 Load</button>
        <button onClick={() => setHelpOpen(true)} style={toolbarBtn('#339af0')}>❓ Help</button>
        <button onClick={() => navigate('/')} style={toolbarBtn('#fa5252')}>🏠 Sảnh chờ</button>
      </div>

      <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${SIZE}, 30px)`,
          gap: 2,
          backgroundColor: '#333', 
          padding: '10px',
          borderRadius: '15px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
      }}>
        {cells.map((cell) => {
          let bg = '#222'; 
          
          if (cell.isSnakeHead) bg = '#91490f'; 
          else if (cell.isSnakeBody) bg = '#40c057'; 
          
          if (cell.isFood) bg = '#fa5252'; 
          if (cell.isObstacle) bg = 'grey'; 

          return (
            <div
              key={`${cell.x}-${cell.y}`}
              style={{
                width: 30,
                height: 30,
                background: bg,
                borderRadius: cell.isFood ? '50%' : cell.isObstacle ? '4px' : '0'
              }}
            />
          );
        })}
      </div>

      <div style={{ width: '100%', maxWidth: '700px', marginTop: '24px' }}>
         <GameHelpModal open={helpOpen} onClose={() => setHelpOpen(false)} content={helpText} />
         <GameRating gameSlug="snake" />
      </div>
    </div>
  );
}