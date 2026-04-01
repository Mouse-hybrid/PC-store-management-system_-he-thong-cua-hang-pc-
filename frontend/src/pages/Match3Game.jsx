import React, { useEffect, useState } from 'react';
import GameHelpModal from '../components/GameHelpModal';
import GameRating from '../components/GameRating';
import { getGameHelp, loadGameState, saveGameState, submitScore } from '../utils/gameStorage';

const SIZE = 6;
const COLORS = ['🔴', '🟡', '🟢', '🔵', '🟣'];

const randomCell = () => COLORS[Math.floor(Math.random() * COLORS.length)];

function createBoard() {
  return Array.from({ length: SIZE * SIZE }, () => randomCell());
}

function clearMatches(board) {
  const next = [...board];
  let removed = 0;

  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE - 2; c++) {
      const i = r * SIZE + c;
      if (next[i] && next[i] === next[i + 1] && next[i] === next[i + 2]) {
        next[i] = next[i + 1] = next[i + 2] = null;
        removed += 3;
      }
    }
  }

  for (let c = 0; c < SIZE; c++) {
    for (let r = 0; r < SIZE - 2; r++) {
      const i = r * SIZE + c;
      if (next[i] && next[i] === next[i + SIZE] && next[i] === next[i + SIZE * 2]) {
        next[i] = next[i + SIZE] = next[i + SIZE * 2] = null;
        removed += 3;
      }
    }
  }

  for (let c = 0; c < SIZE; c++) {
    let col = [];
    for (let r = 0; r < SIZE; r++) {
      const val = next[r * SIZE + c];
      if (val) col.push(val);
    }
    while (col.length < SIZE) col.unshift(randomCell());
    for (let r = 0; r < SIZE; r++) {
      next[r * SIZE + c] = col[r];
    }
  }

  return { board: next, removed };
}

export default function Match3Game() {
  const [board, setBoard] = useState(createBoard());
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [helpOpen, setHelpOpen] = useState(false);
  const [helpText, setHelpText] = useState('');
  const [startTime] = useState(Date.now());

  useEffect(() => {
    getGameHelp('match-3').then((res) => setHelpText(res.data.instructions || ''));
  }, []);

  const swapIfAdjacent = (a, b) => {
    const ar = Math.floor(a / SIZE);
    const ac = a % SIZE;
    const br = Math.floor(b / SIZE);
    const bc = b % SIZE;
    return Math.abs(ar - br) + Math.abs(ac - bc) === 1;
  };

  const handleCellClick = (index) => {
    if (selected === null) {
      setSelected(index);
      return;
    }

    if (!swapIfAdjacent(selected, index)) {
      setSelected(index);
      return;
    }

    const next = [...board];
    [next[selected], next[index]] = [next[index], next[selected]];

    const result = clearMatches(next);
    setBoard(result.board);
    if (result.removed > 0) {
      setScore((s) => s + result.removed * 10);
    }

    setSelected(null);
  };

  const handleSave = async () => {
    await saveGameState('match-3', { boardState: { board, score }, isPlayerTurn: true });
    alert('Đã lưu match-3');
  };

  const handleLoad = async () => {
    const data = await loadGameState('match-3');
    const parsed = typeof data.state_data === 'string' ? JSON.parse(data.state_data) : data.state_data;
    const state = parsed.boardState || parsed.board || {};
    if (state.board) setBoard(state.board);
    if (typeof state.score === 'number') setScore(state.score);
  };

  const handleFinish = async () => {
    await submitScore('match-3', score, Math.floor((Date.now() - startTime) / 1000));
    alert('Đã lưu điểm');
  };

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <h1>Match-3</h1>
      <p>Điểm: {score}</p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button onClick={handleSave}>Save</button>
        <button onClick={handleLoad}>Load</button>
        <button onClick={() => setHelpOpen(true)}>Help</button>
        <button onClick={handleFinish}>Kết thúc</button>
      </div>

      <div style={grid}>
        {board.map((cell, index) => (
          <button
            key={index}
            onClick={() => handleCellClick(index)}
            style={{
              width: 56,
              height: 56,
              fontSize: 28,
              border: selected === index ? '3px solid red' : '1px solid #ccc',
            }}
          >
            {cell}
          </button>
        ))}
      </div>

      <GameHelpModal open={helpOpen} onClose={() => setHelpOpen(false)} content={helpText} />
      <GameRating gameSlug="match-3" />
    </div>
  );
}

const grid = {
  display: 'grid',
  gridTemplateColumns: `repeat(${SIZE}, 56px)`,
  gap: 8,
};