import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  // Danh sách 7 game theo đúng barem chấm điểm
  const games = [
    { id: 'caro5', name: 'CARO HÀNG 5', icon: '⭕❌', desc: 'Chế độ 5 quân liên tiếp (Đã hoàn thiện)', path: '/caro', color: '#fa5252', active: true },
    { id: 'caro4', name: 'CARO HÀNG 4', icon: '⬛⬜', desc: 'Chế độ 4 quân (Sắp ra mắt)', path: '#', color: '#fcc419', active: false },
    { id: 'tictactoe', name: 'TIC-TAC-TOE', icon: '✖️⭕', desc: 'Cờ ca-ro 3x3 cổ điển', path: '/tic-tac-toe', color: '#339af0', active: true },
    { id: 'snake', name: 'RẮN SĂN MỒI', icon: '🐍', desc: 'Trò chơi rắn ăn táo huyền thoại', path: '#', color: '#40c057', active: false },
    { id: 'candy', name: 'GHÉP HÀNG 3', icon: '🍬', desc: 'Ghép kẹo ngọt (Candy Rush)', path: '#', color: '#e64980', active: false },
    { id: 'memory', name: 'CỜ TRÍ NHỚ', icon: '🧠', desc: 'Lật thẻ bài tìm cặp giống nhau', path: '#', color: '#7950f2', active: false },
    { id: 'draw', name: 'BẢNG VẼ', icon: '🎨', desc: 'Giao diện vẽ tự do sáng tạo', path: '/draw', color: '#fd7e14', active: true },
  ];

  return (
    <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-main)', flex: 1, width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '36px', color: '#fcc419', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '2px' }}>
        🎮 Sảnh Trò Chơi LED MATRIX
      </h1>
      <p style={{ fontSize: '18px', opacity: 0.8, marginBottom: '40px' }}>
        Vui lòng chọn một trò chơi để bắt đầu!
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '25px', justifyContent: 'center' }}>
        {games.map((game) => (
          <div 
            key={game.id}
            onClick={() => {
                if (game.active) {
                    // Tăng bộ đếm lượt chơi mỗi khi có người click vào game
                    const currentClicks = parseInt(localStorage.getItem('totalPlays') || '156'); // Số 156 là con số khởi điểm cho đẹp
                    localStorage.setItem('totalPlays', currentClicks + 1);
                    navigate(game.path);
                } else {
                    alert('Trò chơi đang được phát triển!');
                }
                }}
            style={{ 
              backgroundColor: 'var(--control-bg)', 
              padding: '30px 20px', 
              borderRadius: '15px', 
              cursor: game.active ? 'pointer' : 'not-allowed', 
              transition: 'all 0.3s', 
              boxShadow: game.active ? `0 0 15px ${game.color}40` : '0 4px 10px rgba(0,0,0,0.2)', 
              border: `2px solid ${game.active ? game.color : 'transparent'}`,
              opacity: game.active ? 1 : 0.6
            }}
            onMouseOver={(e) => { 
              if(game.active) {
                e.currentTarget.style.transform = 'translateY(-10px)'; 
                e.currentTarget.style.boxShadow = `0 10px 25px ${game.color}80`;
              }
            }}
            onMouseOut={(e) => { 
              if(game.active) {
                e.currentTarget.style.transform = 'translateY(0)'; 
                e.currentTarget.style.boxShadow = `0 0 15px ${game.color}40`;
              }
            }}
          >
            <div style={{ fontSize: '60px', marginBottom: '15px', filter: game.active ? 'none' : 'grayscale(100%)' }}>
              {game.icon}
            </div>
            <h2 style={{ color: game.color, margin: '10px 0', fontSize: '20px' }}>{game.name}</h2>
            <p style={{ fontSize: '14px', opacity: 0.8 }}>{game.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;