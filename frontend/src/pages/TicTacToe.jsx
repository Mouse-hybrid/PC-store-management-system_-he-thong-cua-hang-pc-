import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TicTacToe = () => {
  const navigate = useNavigate();
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);

  // Logic kiểm tra người thắng
  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Ngang
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Dọc
      [0, 4, 8], [2, 4, 6]             // Chéo
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const winner = calculateWinner(board);
  const isDraw = !winner && !board.includes(null);

  const handleClick = (index) => {
    if (board[index] || winner) return;
    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '40px', color: 'var(--text-main)' }}>
      <h1 style={{ color: '#339af0', fontSize: '36px', letterSpacing: '2px', textTransform: 'uppercase' }}>❌ Tic-Tac-Toe ⭕</h1>
      
      <div style={{ fontSize: '20px', fontWeight: 'bold', margin: '20px 0', minHeight: '30px' }}>
        {winner ? `🎉 Người chiến thắng: ${winner}` : isDraw ? '🤝 Trò chơi Hòa!' : `👉 Lượt tiếp theo: ${isXNext ? 'X' : 'O'}`}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 100px)', gap: '10px', backgroundColor: 'var(--control-bg)', padding: '15px', borderRadius: '15px', boxShadow: '0 8px 20px rgba(0,0,0,0.3)' }}>
        {board.map((cell, index) => (
          <button 
            key={index} 
            onClick={() => handleClick(index)}
            style={{ 
              width: '100px', height: '100px', fontSize: '60px', fontWeight: 'bold', 
              backgroundColor: 'var(--bg-main)', border: 'none', borderRadius: '10px', cursor: 'pointer',
              color: cell === 'X' ? '#fa5252' : '#339af0',
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)'
            }}
          >
            {cell}
          </button>
        ))}
      </div>

      <div style={{ marginTop: '30px', display: 'flex', gap: '15px' }}>
        <button onClick={resetGame} style={{ padding: '10px 20px', background: '#40c057', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>🔄 Chơi lại</button>
        <button onClick={() => navigate('/')} style={{ padding: '10px 20px', background: '#fa5252', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>🏠 Sảnh chờ</button>
      </div>
    </div>
  );
};

export default TicTacToe;