import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Undo2, CornerDownLeft, HelpCircle } from 'lucide-react';
import './GameBoard.css';

const GameBoard = () => {
  const rows = 20;
  const cols = 20;
  const totalDots = rows * cols;
  const navigate = useNavigate();

  // Hàm chuyển đổi tọa độ [hàng, cột] thành index (từ 0 đến 399)
  const getIndex = (r, c) => r * cols + c;

  // 1. DANH SÁCH 7 TRÒ CHƠI VÀ TỌA ĐỘ CHỮ HIỂN THỊ
  const gamesList = [
    {
      id: 'caro-5',
      name: 'Caro 5',
      route: '/game/caro-5',
      coords: [
        // Chữ: C A R O
        [2,2],[2,3],[2,4], [3,1], [4,1], [5,1], [6,2],[6,3],[6,4],
        [2,7], [3,6],[3,8], [4,6],[4,7],[4,8], [5,6],[5,8], [6,6],[6,8],
        [2,10],[2,11], [3,10],[3,12], [4,10],[4,11], [5,10],[5,12], [6,10],[6,12],
        [2,15], [3,14],[3,16], [4,14],[4,16], [5,14],[5,16], [6,15],
        // Số: 5
        [8,7],[8,8],[8,9], [9,7], [10,7],[10,8], [11,9], [12,7],[12,8]
      ]
    },
    {
      id: 'caro-4',
      name: 'Caro 4',
      route: '/game/caro-4',
      coords: [
        // Chữ: C A R O
        [2,2],[2,3],[2,4], [3,1], [4,1], [5,1], [6,2],[6,3],[6,4],
        [2,7], [3,6],[3,8], [4,6],[4,7],[4,8], [5,6],[5,8], [6,6],[6,8],
        [2,10],[2,11], [3,10],[3,12], [4,10],[4,11], [5,10],[5,12], [6,10],[6,12],
        [2,15], [3,14],[3,16], [4,14],[4,16], [5,14],[5,16], [6,15],
        // Số: 4
        [8,8],[8,9], [9,7],[9,9], [10,7],[10,8],[10,9],[10,10], [11,9], [12,9]
      ]
    },
    {
      id: 'tic-tac-toe',
      name: 'Tic Tac Toe',
      route: '/game/tic-tac-toe',
      coords: [
        // Chữ: T T T
        [2,3],[2,4],[2,5], [3,4], [4,4], [5,4], [6,4],
        [2,9],[2,10],[2,11], [3,10], [4,10], [5,10], [6,10],
        [2,15],[2,16],[2,17], [3,16], [4,16], [5,16], [6,16]
      ]
    },
    {
      id: 'snake',
      name: 'Rắn săn mồi',
      route: '/game/snake',
      coords: [
        // Chữ: S N A K
        [2,2],[2,3],[2,4], [3,2], [4,2],[4,3],[4,4], [5,4], [6,2],[6,3],[6,4],
        [2,6],[2,8], [3,6],[3,7],[3,8], [4,6],[4,8], [5,6],[5,8], [6,6],[6,8],
        [2,10],[2,11],[2,12], [3,10],[3,12], [4,10],[4,11],[4,12], [5,10],[5,12], [6,10],[6,12],
        [2,14],[2,16], [3,14],[3,15], [4,14],[4,15], [5,14],[5,16], [6,14],[6,16],
        // Chữ: E (xuống dòng)
        [8,9],[8,10],[8,11], [9,9], [10,9],[10,10], [11,9], [12,9],[12,10],[12,11]
      ]
    },
    {
      id: 'match-3',
      name: 'Ghép hàng 3',
      route: '/game/match-3',
      coords: [
        // Chữ: M A T
        [2,2],[2,6], [3,2],[3,3],[3,5],[3,6], [4,2],[4,4],[4,6], [5,2],[5,6], [6,2],[6,6],
        [2,8],[2,9],[2,10], [3,8],[3,10], [4,8],[4,9],[4,10], [5,8],[5,10], [6,8],[6,10],
        [2,12],[2,13],[2,14], [3,13], [4,13], [5,13], [6,13],
        // Số: 3 (xuống dòng)
        [8,9],[8,10],[8,11], [9,11], [10,9],[10,10],[10,11], [11,11], [12,9],[12,10],[12,11]
      ]
    },
    {
      id: 'memory',
      name: 'Cờ trí nhớ',
      route: '/game/memory',
      coords: [
        // Chữ: M E M O
        [2,1],[2,5], [3,1],[3,2],[3,4],[3,5], [4,1],[4,3],[4,5], [5,1],[5,5], [6,1],[6,5],
        [2,7],[2,8],[2,9], [3,7], [4,7],[4,8], [5,7], [6,7],[6,8],[6,9],
        [2,11],[2,15], [3,11],[3,12],[3,14],[3,15], [4,11],[4,13],[4,15], [5,11],[5,15], [6,11],[6,15],
        [2,17],[2,18], [3,16],[3,19], [4,16],[4,19], [5,16],[5,19], [6,17],[6,18]
      ]
    },
    {
      id: 'free-draw',
      name: 'Bảng vẽ',
      route: '/game/free-draw',
      coords: [
        // Chữ: D R A W
        [2,3],[2,4], [3,3],[3,5], [4,3],[4,5], [5,3],[5,5], [6,3],[6,4],
        [2,7],[2,8], [3,7],[3,9], [4,7],[4,8], [5,7],[5,9], [6,7],[6,9],
        [2,11],[2,12],[2,13], [3,11],[3,13], [4,11],[4,12],[4,13], [5,11],[5,13], [6,11],[6,13],
        [2,15],[2,19], [3,15],[3,19], [4,15],[4,17],[4,19], [5,15],[5,16],[5,18],[5,19], [6,15],[6,19]
      ]
    }
  ];

  // 2. STATE QUẢN LÝ GAME ĐANG ĐƯỢC CHỌN (Mặc định là 0: Caro 5)
  const [selectedIndex, setSelectedIndex] = useState(0);

  // 3. TỌA ĐỘ CÁC BIỂU TƯỢNG XANH (Giữ nguyên để trang trí)
  const blueCoords = [
    [8,12],[8,14], [9,13], [10,12],[10,14], // Chữ X
    [8,16],[8,17],[8,18], [9,16],[9,18], [10,16],[10,17],[10,18], // Chữ O
    [13,13], [14,12],[14,13],[14,14], [15,13], // Dấu +
    [13,16],[13,17],[13,18], [14,16],[14,18], [15,16],[15,17],[15,18] // Hình vuông
  ];

  // 4. CÁC HÀM XỬ LÝ SỰ KIỆN CLICK
  const handleLeftClick = () => {
    setSelectedIndex((prev) => (prev === 0 ? gamesList.length - 1 : prev - 1));
  };

  const handleRightClick = () => {
    setSelectedIndex((prev) => (prev === gamesList.length - 1 ? 0 : prev + 1));
  };

  const handleEnterClick = () => {
    const selectedGame = gamesList[selectedIndex];
    
    // Vì hiện tại ta mới chỉ code giao diện cho Caro 5, nên ta chặn các game khác lại
    if (selectedGame.id === 'caro-5') {
      navigate(selectedGame.route);
    } else {
      alert(`Đang mở khóa tựa game: ${selectedGame.name}!\n(Giao diện game này sẽ được thiết kế sau)`);
    }
  };

  // 5. CHUYỂN ĐỔI TỌA ĐỘ SANG INDEX ĐỂ RENDER
  const currentRedCoords = gamesList[selectedIndex].coords;
  const redIndices = currentRedCoords.map(([r, c]) => getIndex(r, c));
  const blueIndices = blueCoords.map(([r, c]) => getIndex(r, c));

  return (
    <div className="board-container">
      {/* Khung Ma trận nút bấm */}
      <div 
        className="matrix-board" 
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {Array.from({ length: totalDots }).map((_, index) => {
          let colorClass = "";
          // Tô màu đỏ cho chữ cái đại diện game
          if (redIndices.includes(index)) colorClass = "red";
          // Tô màu xanh cho cụm biểu tượng trang trí
          else if (blueIndices.includes(index)) colorClass = "blue";

          return <div key={index} className={`dot ${colorClass}`}></div>;
        })}
      </div>

      {/* Khung Control Pad */}
      <div className="control-pad">
        <div className="row-top">
          <button className="btn-control btn-dark" onClick={handleLeftClick}>
            <ArrowLeft size={24} />
          </button>
          <button className="btn-control btn-dark" onClick={handleRightClick}>
            <ArrowRight size={24} />
          </button>
        </div>
        <div className="row-bottom">
          <button className="btn-control btn-yellow">
            <Undo2 size={20} />
          </button>
          {/* Nút ENTER màu đỏ để vào game */}
          <button className="btn-control btn-red" onClick={handleEnterClick}>
            <CornerDownLeft size={20} />
          </button>
          <button className="btn-control btn-blue">
            <HelpCircle size={20} />
          </button>
        </div>
      </div>
      
      <p style={{ marginTop: '20px', color: 'var(--text-main)', fontWeight: 'bold', letterSpacing: '2px', opacity: 0.6 }}>
        SELECT GAME (LEFT/RIGHT -{'>'} ENTER)
      </p>
    </div>
  );
};

export default GameBoard;