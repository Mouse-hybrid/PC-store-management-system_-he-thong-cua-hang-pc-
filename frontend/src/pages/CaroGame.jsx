import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import GameRating from '../components/GameRating';
import { submitScore } from '../utils/gameStorage';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Undo2,
  CornerDownLeft,
  HelpCircle,
  Save,
} from 'lucide-react';
import './CaroGame.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:3636';

export default function CaroGame({
  title = 'CARO 5',
  gameSlug = 'caro-5',
  boardSize = 20,
  winLength = 5,
}) {
  const navigate = useNavigate();

  const ROWS = boardSize;
  const COLS = boardSize;
  const TOTAL_CELLS = ROWS * COLS;

  const [gameStage, setGameStage] = useState('SELECT_MODE');
  const [menuIndex, setMenuIndex] = useState(0); // 0 = NEW, 1 = LOAD
  const [board, setBoard] = useState(Array(TOTAL_CELLS).fill(null));
  const [cursor, setCursor] = useState(Math.floor(TOTAL_CELLS / 2));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const [helpText, setHelpText] = useState(
    'Mục tiêu: tạo đủ chuỗi liên tiếp để chiến thắng.\nDùng các nút điều hướng để di chuyển con trỏ.\nENTER để đánh dấu.\nBACK để quay lại chọn chế độ.'
  );
  const [scoreSubmitted, setScoreSubmitted] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());

  const getIndex = (r, c) => r * COLS + c;

  const { newIndices, loadIndices } = useMemo(() => {
    const centerRow = Math.floor(ROWS / 2);
    const leftStartCol = Math.max(1, Math.floor(COLS / 2) - 5);
    const rightStartCol = Math.min(COLS - 4, Math.floor(COLS / 2) + 2);

    const makeBlock = (startRow, startCol) => {
      const indices = [];
      for (let r = startRow; r < startRow + 3; r++) {
        for (let c = startCol; c < startCol + 3; c++) {
          if (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
            indices.push(getIndex(r, c));
          }
        }
      }
      return indices;
    };

    return {
      newIndices: makeBlock(centerRow - 1, leftStartCol),
      loadIndices: makeBlock(centerRow - 1, rightStartCol),
    };
  }, [ROWS, COLS]);

  const resetGame = () => {
    setBoard(Array(TOTAL_CELLS).fill(null));
    setWinner(null);
    setIsPlayerTurn(true);
    setCursor(Math.floor(TOTAL_CELLS / 2));
    setScoreSubmitted(false);
    setStartTime(Date.now());
  };

  const handleLeft = () => {
    if (gameStage === 'SELECT_MODE') {
      setMenuIndex((prev) => (prev === 0 ? 1 : 0));
      return;
    }
    if (cursor % COLS > 0) setCursor((c) => c - 1);
  };

  const handleRight = () => {
    if (gameStage === 'SELECT_MODE') {
      setMenuIndex((prev) => (prev === 0 ? 1 : 0));
      return;
    }
    if (cursor % COLS < COLS - 1) setCursor((c) => c + 1);
  };

  const handleUp = () => {
    if (gameStage === 'SELECT_MODE') {
      setMenuIndex((prev) => (prev === 0 ? 1 : 0));
      return;
    }
    if (cursor >= COLS) setCursor((c) => c - COLS);
  };

  const handleDown = () => {
    if (gameStage === 'SELECT_MODE') {
      setMenuIndex((prev) => (prev === 0 ? 1 : 0));
      return;
    }
    if (cursor < TOTAL_CELLS - COLS) setCursor((c) => c + COLS);
  };

  const handleBack = () => {
    if (gameStage === 'SELECT_MODE') {
      navigate('/');
      return;
    }
    setGameStage('SELECT_MODE');
    setWinner(null);
  };

  const handleHelp = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setHelpOpen(true);
        return;
      }

      const res = await axios.get(`${API_BASE_URL}/api/game/${gameSlug}/help`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const instructions =
        res?.data?.data?.instructions ||
        res?.data?.instructions ||
        'Chưa có hướng dẫn cho trò chơi này.';

      setHelpText(instructions);
    } catch (error) {
      console.error('Lỗi lấy hướng dẫn:', error);
    } finally {
      setHelpOpen(true);
    }
  };

  const handleSave = async () => {
    if (gameStage !== 'PLAYING') {
      alert('Hãy vào ván chơi trước khi lưu.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Bạn cần đăng nhập để lưu game.');
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}/api/game/save`,
        {
          gameSlug,
          boardState: board,
          isPlayerTurn,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('Lưu game thành công!');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Lỗi kết nối đến máy chủ!';
      alert(`Lưu thất bại: ${errorMsg}`);
    }
  };

  const handleLoad = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Bạn cần đăng nhập để tải game.');
      return;
    }

    try {
      const res = await axios.get(`${API_BASE_URL}/api/game/load/${gameSlug}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const savedData =
        typeof res.data.state_data === 'string'
          ? JSON.parse(res.data.state_data)
          : res.data.state_data;

      const nextBoard =
        savedData.board ||
        savedData.boardState ||
        Array(TOTAL_CELLS).fill(null);

      setBoard(nextBoard);
      setIsPlayerTurn(
        typeof savedData.isPlayerTurn === 'boolean' ? savedData.isPlayerTurn : true
      );
      setWinner(null);
      setCursor(Math.floor(TOTAL_CELLS / 2));
      setGameStage('PLAYING');
      setScoreSubmitted(false);
      setStartTime(Date.now());

      alert('Tải ván game cũ thành công!');
    } catch (error) {
      alert(error?.response?.data?.message || 'Không tìm thấy dữ liệu lưu trữ!');
    }
  };

  const checkWin = (currentBoard, index, player) => {
    const r = Math.floor(index / COLS);
    const c = index % COLS;
    const directions = [
      [0, 1],
      [1, 0],
      [1, 1],
      [1, -1],
    ];

    for (const [dr, dc] of directions) {
      let count = 1;

      for (let i = 1; i < winLength; i++) {
        const nr = r + dr * i;
        const nc = c + dc * i;
        if (
          nr >= 0 &&
          nr < ROWS &&
          nc >= 0 &&
          nc < COLS &&
          currentBoard[nr * COLS + nc] === player
        ) {
          count++;
        } else {
          break;
        }
      }

      for (let i = 1; i < winLength; i++) {
        const nr = r - dr * i;
        const nc = c - dc * i;
        if (
          nr >= 0 &&
          nr < ROWS &&
          nc >= 0 &&
          nc < COLS &&
          currentBoard[nr * COLS + nc] === player
        ) {
          count++;
        } else {
          break;
        }
      }

      if (count >= winLength) return true;
    }

    return false;
  };

  const handleEnter = async () => {
    if (gameStage === 'SELECT_MODE') {
      if (menuIndex === 0) {
        resetGame();
        setGameStage('PLAYING');
      } else {
        await handleLoad();
      }
      return;
    }

    if (board[cursor] || winner || !isPlayerTurn) return;

    const newBoard = [...board];
    newBoard[cursor] = 'X';
    setBoard(newBoard);

    if (checkWin(newBoard, cursor, 'X')) {
      setWinner('Player');
      return;
    }

    const hasEmpty = newBoard.some((cell) => cell === null);
    if (!hasEmpty) {
      setWinner('Draw');
      return;
    }

    setIsPlayerTurn(false);
  };

  useEffect(() => {
    if (gameStage !== 'PLAYING' || isPlayerTurn || winner) return;

    const emptyIndices = board
      .map((val, idx) => (val === null ? idx : null))
      .filter((val) => val !== null);

    if (emptyIndices.length === 0) {
      setWinner('Draw');
      return;
    }

    const timeout = setTimeout(() => {
      const randomIndex =
        emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
      const newBoard = [...board];
      newBoard[randomIndex] = 'O';
      setBoard(newBoard);

      if (checkWin(newBoard, randomIndex, 'O')) {
        setWinner('Computer');
        return;
      }

      const hasEmpty = newBoard.some((cell) => cell === null);
      if (!hasEmpty) {
        setWinner('Draw');
        return;
      }

      setIsPlayerTurn(true);
    }, 450);

    return () => clearTimeout(timeout);
  }, [isPlayerTurn, board, winner, gameStage]);

  useEffect(() => {
    if (gameStage !== 'PLAYING') return;
    if (!winner || scoreSubmitted) return;

    const seconds = Math.floor((Date.now() - startTime) / 1000);
    const score =
      winner === 'Player' ? 100 :
      winner === 'Draw' ? 50 :
      20;

    submitScore(gameSlug, score, seconds).catch(console.error);
    setScoreSubmitted(true);
  }, [winner, gameStage, scoreSubmitted, startTime, gameSlug]);

  const renderStatus = () => {
    if (gameStage === 'SELECT_MODE') {
      return `CHỌN CHẾ ĐỘ: ${menuIndex === 0 ? 'VÁN MỚI' : 'TẢI GAME'}`;
    }

    if (winner === 'Draw') return '🤝 Hòa!';
    if (winner === 'Player') return '🎉 Bạn thắng!';
    if (winner === 'Computer') return '🤖 Máy thắng!';

    return `Lượt: ${isPlayerTurn ? 'Bạn' : 'Máy'}`;
  };

  return (
    <div className="caro-container">
      <div
        style={{
          width: '100%',
          maxWidth: '560px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '10px',
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        <h2 style={{ color: 'var(--text-main)', margin: 0 }}>
          {title} ({boardSize}x{boardSize} - thắng {winLength})
        </h2>

        <button
          onClick={handleSave}
          style={{
            background: '#40c057',
            color: 'white',
            padding: '8px 12px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontWeight: 'bold',
          }}
        >
          <Save size={16} /> Lưu Game
        </button>
      </div>

      <div
        style={{
          minHeight: '30px',
          fontWeight: 'bold',
          marginBottom: '10px',
          color: 'var(--text-main)',
          textAlign: 'center',
        }}
      >
        {renderStatus()}
      </div>

      <div
        style={{
          marginBottom: '10px',
          color: 'var(--text-main)',
          opacity: 0.85,
          fontSize: '14px',
          textAlign: 'center',
        }}
      >
        SELECT MODE: ô đỏ = ván mới, ô xanh = tải game
      </div>

      <div className="matrix-board" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
        {board.map((cell, index) => {
          let colorClass = '';

          if (gameStage === 'SELECT_MODE') {
            if (menuIndex === 0 && newIndices.includes(index)) colorClass = 'red';
            if (menuIndex === 1 && loadIndices.includes(index)) colorClass = 'blue';
          } else {
            if (cell === 'X') colorClass = 'red';
            else if (cell === 'O') colorClass = 'blue';
            else if (index === cursor && !winner) colorClass = 'yellow';
          }

          return <div key={index} className={`dot ${colorClass}`}></div>;
        })}
      </div>

      <div className="control-pad">
        <div className="pad-row">
          <button className="btn-control btn-dark" onClick={handleUp}>
            <ArrowUp size={24} />
          </button>
        </div>

        <div className="pad-row">
          <button className="btn-control btn-dark" onClick={handleLeft}>
            <ArrowLeft size={24} />
          </button>
          <button className="btn-control btn-dark" onClick={handleDown}>
            <ArrowDown size={24} />
          </button>
          <button className="btn-control btn-dark" onClick={handleRight}>
            <ArrowRight size={24} />
          </button>
        </div>

        <div className="pad-row" style={{ marginTop: '5px' }}>
          <button className="btn-control btn-yellow" onClick={handleBack}>
            <Undo2 size={20} />
          </button>
          <button className="btn-control btn-red" onClick={handleEnter}>
            <CornerDownLeft size={20} />
          </button>
          <button className="btn-control btn-blue" onClick={handleHelp}>
            <HelpCircle size={20} />
          </button>
        </div>
      </div>

      {helpOpen && (
        <div
          onClick={() => setHelpOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'white',
              color: '#111',
              width: 'min(560px, 92vw)',
              borderRadius: '12px',
              padding: '20px',
            }}
          >
            <h3 style={{ marginTop: 0 }}>{title} - Hướng dẫn</h3>
            <p style={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}>{helpText}</p>
            <button
              onClick={() => setHelpOpen(false)}
              style={{
                marginTop: '12px',
                padding: '10px 14px',
                border: 'none',
                borderRadius: '8px',
                background: '#339af0',
                color: 'white',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      <div style={{ width: '100%', maxWidth: '700px', marginTop: '24px' }}>
        <GameRating gameSlug={gameSlug} />
      </div>
    </div>
  );
}