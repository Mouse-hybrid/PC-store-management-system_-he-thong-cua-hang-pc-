import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameHelpModal from '../components/GameHelpModal';
import GameRating from '../components/GameRating';
import { getGameHelp, loadGameState, saveGameState, submitScore } from '../utils/gameStorage';

const GAME_SLUG = 'tic-tac-toe';

const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

export default function TicTacToe() {
  const navigate = useNavigate();

  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true); // Player = X, Computer = O
  const [helpOpen, setHelpOpen] = useState(false);
  const [helpText, setHelpText] = useState('');
  const [scoreSubmitted, setScoreSubmitted] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());

  useEffect(() => {
    getGameHelp(GAME_SLUG)
      .then((res) => setHelpText(res.data?.instructions || ''))
      .catch(() => setHelpText('Đặt 3 ký hiệu liên tiếp để chiến thắng.'));
  }, []);

  const winner = useMemo(() => calculateWinner(board), [board]);
  const isDraw = useMemo(() => !winner && !board.includes(null), [winner, board]);

  useEffect(() => {
    if (!isPlayerTurn || winner || isDraw) return;

    // player turn, no-op
  }, [isPlayerTurn, winner, isDraw]);

  useEffect(() => {
    if (isPlayerTurn || winner || isDraw) return;

    const emptyIndices = board
      .map((cell, index) => (cell === null ? index : null))
      .filter((x) => x !== null);

    if (!emptyIndices.length) return;

    const timer = setTimeout(() => {
      const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
      setBoard((prev) => {
        const next = [...prev];
        next[randomIndex] = 'O';
        return next;
      });
      setIsPlayerTurn(true);
    }, 450);

    return () => clearTimeout(timer);
  }, [isPlayerTurn, board, winner, isDraw]);

  useEffect(() => {
    if (scoreSubmitted) return;
    if (!winner && !isDraw) return;

    const seconds = Math.floor((Date.now() - startTime) / 1000);
    const score =
      winner === 'X' ? 100 :
      winner === 'O' ? 20 :
      50;

    submitScore(GAME_SLUG, score, seconds).catch(console.error);
    setScoreSubmitted(true);
  }, [winner, isDraw, scoreSubmitted, startTime]);

  const handleClick = (index) => {
    if (!isPlayerTurn) return;
    if (board[index] || winner || isDraw) return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
    setIsPlayerTurn(false);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setScoreSubmitted(false);
    setStartTime(Date.now());
  };

  const handleSave = async () => {
    try {
      await saveGameState(GAME_SLUG, {
        boardState: board,
        isPlayerTurn,
      });
      alert('Đã lưu Tic-Tac-Toe');
    } catch (error) {
      alert(error?.response?.data?.message || 'Không lưu được game');
    }
  };

  const handleLoad = async () => {
    try {
      const data = await loadGameState(GAME_SLUG);
      const parsed =
        typeof data.state_data === 'string'
          ? JSON.parse(data.state_data)
          : data.state_data;

      const nextBoard = parsed.boardState || parsed.board || Array(9).fill(null);
      setBoard(nextBoard);
      setIsPlayerTurn(
        typeof parsed.isPlayerTurn === 'boolean' ? parsed.isPlayerTurn : true
      );
      setScoreSubmitted(false);
      setStartTime(Date.now());
      alert('Đã tải Tic-Tac-Toe');
    } catch (error) {
      alert(error?.response?.data?.message || 'Không tải được game');
    }
  };

  const statusText = winner
    ? winner === 'X'
      ? '🎉 Bạn thắng!'
      : '🤖 Máy thắng!'
    : isDraw
    ? '🤝 Hòa!'
    : `👉 Lượt: ${isPlayerTurn ? 'Bạn (X)' : 'Máy (O)'}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '40px', color: 'var(--text-main)', padding: '0 16px 40px' }}>
      <h1 style={{ color: '#339af0', fontSize: '36px', letterSpacing: '2px', textTransform: 'uppercase' }}>
        ❌ Tic-Tac-Toe ⭕
      </h1>

      <div style={{ fontSize: '20px', fontWeight: 'bold', margin: '20px 0', minHeight: '30px' }}>
        {statusText}
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '18px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button onClick={handleSave} style={toolbarBtn('#40c057')}>💾 Save</button>
        <button onClick={handleLoad} style={toolbarBtn('#845ef7')}>📂 Load</button>
        <button onClick={() => setHelpOpen(true)} style={toolbarBtn('#339af0')}>❓ Help</button>
        <button onClick={resetGame} style={toolbarBtn('#fcc419', '#111')}>🔄 Chơi lại</button>
        <button onClick={() => navigate('/')} style={toolbarBtn('#fa5252')}>🏠 Sảnh chờ</button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 100px)',
          gap: '10px',
          backgroundColor: 'var(--control-bg)',
          padding: '15px',
          borderRadius: '15px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
        }}
      >
        {board.map((cell, index) => (
          <button
            key={index}
            onClick={() => handleClick(index)}
            style={{
              width: '100px',
              height: '100px',
              fontSize: '60px',
              fontWeight: 'bold',
              backgroundColor: 'var(--bg-main)',
              border: 'none',
              borderRadius: '10px',
              cursor: winner || isDraw || !isPlayerTurn ? 'default' : 'pointer',
              color: cell === 'X' ? '#fa5252' : '#339af0',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)',
            }}
          >
            {cell}
          </button>
        ))}
      </div>

      <GameHelpModal
        open={helpOpen}
        onClose={() => setHelpOpen(false)}
        title="Tic-Tac-Toe - Hướng dẫn"
        content={helpText}
      />

      <GameRating gameSlug={GAME_SLUG} />
    </div>
  );
}

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