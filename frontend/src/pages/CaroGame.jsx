import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Undo2, CornerDownLeft, HelpCircle, Save } from 'lucide-react';
import './CaroGame.css';

const ROWS = 20;
const COLS = 20;
const TOTAL_CELLS = ROWS * COLS;

const CaroGame = () => {
  const navigate = useNavigate();
  const [gameStage, setGameStage] = useState('SELECT_MODE'); 
  const [menuIndex, setMenuIndex] = useState(0); 
  const [board, setBoard] = useState(Array(TOTAL_CELLS).fill(null));
  const [cursor, setCursor] = useState(190); 
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState(null);

  const getIndex = (r, c) => r * COLS + c;

  const newCoords = [[8,3],[9,3],[10,3],[11,3],[12,3],[9,4],[10,5],[11,6],[8,7],[9,7],[10,7],[11,7],[12,7],[8,9],[9,9],[10,9],[11,9],[12,9],[8,10],[8,11],[10,10],[10,11],[12,10],[12,11],[8,13],[9,13],[10,13],[11,13],[12,13],[11,14],[10,15],[11,16],[8,17],[9,17],[10,17],[11,17],[12,17]];
  const loadCoords = [[8,3],[9,3],[10,3],[11,3],[12,3],[12,4],[12,5],[8,7],[9,7],[10,7],[11,7],[12,7],[8,8],[8,9],[12,8],[12,9],[8,10],[9,10],[10,10],[11,10],[12,10],[8,13],[9,12],[10,12],[11,12],[12,12],[9,14],[10,14],[11,14],[12,14],[8,13],[10,13],[8,16],[9,16],[10,16],[11,16],[12,16],[8,17],[8,18],[9,19],[10,19],[11,19],[12,18],[12,17]];
  const newIndices = newCoords.map(([r, c]) => getIndex(r, c));
  const loadIndices = loadCoords.map(([r, c]) => getIndex(r, c));

  const handleLeft = () => {
    if (gameStage === 'SELECT_MODE') setMenuIndex(prev => (prev === 0 ? 1 : 0));
    else if (gameStage === 'PLAYING' && cursor % COLS > 0) setCursor(c => c - 1);
  };
  const handleRight = () => {
    if (gameStage === 'SELECT_MODE') setMenuIndex(prev => (prev === 0 ? 1 : 0));
    else if (gameStage === 'PLAYING' && cursor % COLS < COLS - 1) setCursor(c => c + 1);
  };
  const handleUp = () => {
    if (gameStage === 'SELECT_MODE') setMenuIndex(prev => (prev === 0 ? 1 : 0));
    else if (gameStage === 'PLAYING' && cursor >= COLS) setCursor(c => c - COLS);
  };
  const handleDown = () => {
    if (gameStage === 'SELECT_MODE') setMenuIndex(prev => (prev === 0 ? 1 : 0));
    else if (gameStage === 'PLAYING' && cursor < TOTAL_CELLS - COLS) setCursor(c => c + COLS);
  };

  const handleBack = () => {
    if (gameStage === 'SELECT_MODE') {
      //navigate('/'); 
      alert('Bạn đang ở màn hình chờ của trò chơi!');
    }
    else setGameStage('SELECT_MODE'); 
  };

  const handleEnter = async () => {
    if (gameStage === 'SELECT_MODE') {
      if (menuIndex === 0) {
        setBoard(Array(TOTAL_CELLS).fill(null));
        setWinner(null);
        setIsPlayerTurn(true);
        setGameStage('PLAYING');
      } else {
        const token = localStorage.getItem('token');
        if (!token) return alert("Bạn cần đăng nhập để tải game!");
        try {
          const res = await axios.get('https://localhost:3636/api/game/load/caro-5', {
            headers: { Authorization: `Bearer ${token}` }
          });
          const savedData = typeof res.data.state_data === 'string' 
            ? JSON.parse(res.data.state_data) 
            : res.data.state_data;
          setBoard(savedData.board);
          setIsPlayerTurn(savedData.isPlayerTurn);
          setWinner(null);
          setGameStage('PLAYING');
          alert("Tải ván game cũ thành công!");
        } catch (error) {
          alert("Không tìm thấy dữ liệu lưu trữ!");
        }
      }
    } else if (gameStage === 'PLAYING') {
      if (board[cursor] || winner || !isPlayerTurn) return;
      const newBoard = [...board];
      newBoard[cursor] = 'X';
      setBoard(newBoard);
      if (checkWin(newBoard, cursor, 'X')) setWinner('Player');
      else setIsPlayerTurn(false);
    }
  };

  const checkWin = (currentBoard, index, player) => {
    const r = Math.floor(index / COLS), c = index % COLS;
    const directions = [[0, 1], [1, 0], [1, 1], [1, -1]]; 
    for (let [dr, dc] of directions) {
      let count = 1;
      for (let i = 1; i < 5; i++) {
        const nr = r + dr * i, nc = c + dc * i;
        if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && currentBoard[nr * COLS + nc] === player) count++; else break;
      }
      for (let i = 1; i < 5; i++) {
        const nr = r - dr * i, nc = c - dc * i;
        if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && currentBoard[nr * COLS + nc] === player) count++; else break;
      }
      if (count >= 5) return true;
    }
    return false;
  };

  useEffect(() => {
    if (gameStage === 'PLAYING' && !isPlayerTurn && !winner) {
      const emptyIndices = board.map((val, idx) => (val === null ? idx : null)).filter(val => val !== null);
      if (emptyIndices.length === 0) return setWinner('Draw');
      const timeout = setTimeout(() => {
        const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        const newBoard = [...board];
        newBoard[randomIndex] = 'O';
        setBoard(newBoard);
        if (checkWin(newBoard, randomIndex, 'O')) setWinner('Computer');
        else setIsPlayerTurn(true);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [isPlayerTurn, board, winner, gameStage]);

  return (
    <div className="caro-container">
      <div style={{ width: '100%', maxWidth: '500px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h2 style={{ color: 'var(--text-main)', margin: 0 }}>CARO 5</h2>
        <button onClick={() => {
          const token = localStorage.getItem('token');
          if(!token) return alert("Bạn cần đăng nhập!");
          axios.post('https://localhost:3636/api/game/save', { gameSlug: 'caro-5', boardState: board, isPlayerTurn }, { headers: { Authorization: `Bearer ${token}` } })
          .then(() => alert("Lưu thành công!"))
          .catch((err) => {
            const errorMsg = err.response?.data?.message || "Lỗi kết nối đến máy chủ!";
            alert("Lưu thất bại: " + errorMsg);
          });
        }} style={{ background: '#40c057', color: 'white', padding: '8px 12px', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Save size={16} /> Lưu Game
        </button>
      </div>

      <div style={{ minHeight: '30px', fontWeight: 'bold', marginBottom: '10px', color: 'var(--text-main)' }}>
        {gameStage === 'SELECT_MODE' ? 'CHỌN CHẾ ĐỘ' : (
          winner ? (winner === 'Draw' ? '🤝 Hòa!' : `🎉 ${winner === 'Player' ? 'Bạn' : 'Máy'} Thắng!`) : `Lượt: ${isPlayerTurn ? 'Bạn' : 'Máy'}`
        )}
      </div>

      <div className="matrix-board" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
        {board.map((cell, index) => {
          let colorClass = "";
          if (gameStage === 'SELECT_MODE') {
            if (menuIndex === 0 && newIndices.includes(index)) colorClass = "red";
            if (menuIndex === 1 && loadIndices.includes(index)) colorClass = "blue";
          } else {
            if (cell === 'X') colorClass = "red";
            else if (cell === 'O') colorClass = "blue";
            if (index === cursor && !cell && !winner) colorClass = "yellow";
          }
          return <div key={index} className={`dot ${colorClass}`}></div>;
        })}
      </div>

      <div className="control-pad">
        <div className="pad-row"><button className="btn-control btn-dark" onClick={handleUp}><ArrowUp size={24} /></button></div>
        <div className="pad-row">
          <button className="btn-control btn-dark" onClick={handleLeft}><ArrowLeft size={24} /></button>
          <button className="btn-control btn-dark" onClick={handleDown}><ArrowDown size={24} /></button>
          <button className="btn-control btn-dark" onClick={handleRight}><ArrowRight size={24} /></button>
        </div>
        <div className="pad-row" style={{ marginTop: '5px' }}>
          <button className="btn-control btn-yellow" onClick={handleBack}><Undo2 size={20} /></button>
          <button className="btn-control btn-red" onClick={handleEnter}><CornerDownLeft size={20} /></button>
          <button className="btn-control btn-blue"><HelpCircle size={20} /></button>
        </div>
      </div>
    </div>
  );
};

export default CaroGame;