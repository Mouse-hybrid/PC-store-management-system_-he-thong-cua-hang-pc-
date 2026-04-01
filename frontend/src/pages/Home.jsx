import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const games = [
  {
    id: 'caro5',
    name: 'CARO HÀNG 5',
    icon: '⭕❌',
    desc: 'Chế độ 5 quân liên tiếp',
    path: '/caro',
    color: '#fa5252',
    active: true,
  },
  {
    id: 'caro4',
    name: 'CARO HÀNG 4',
    icon: '⬛⬜',
    desc: 'Chế độ 4 quân liên tiếp',
    path: '/caro-4',
    color: '#fcc419',
    active: true,
  },
  {
    id: 'tictactoe',
    name: 'TIC-TAC-TOE',
    icon: '✖️⭕',
    desc: 'Cờ ca-ro 3x3 cổ điển',
    path: '/tic-tac-toe',
    color: '#339af0',
    active: true,
  },
  {
    id: 'snake',
    name: 'RẮN SĂN MỒI',
    icon: '🐍',
    desc: 'Điều khiển rắn ăn mồi',
    path: '/snake',
    color: '#40c057',
    active: true,
  },
  {
    id: 'match3',
    name: 'GHÉP HÀNG 3',
    icon: '🍬',
    desc: 'Đổi chỗ để ghép 3 ô giống nhau',
    path: '/match-3',
    color: '#e64980',
    active: true,
  },
  {
    id: 'memory',
    name: 'CỜ TRÍ NHỚ',
    icon: '🧠',
    desc: 'Lật thẻ và tìm cặp giống nhau',
    path: '/memory',
    color: '#7950f2',
    active: true,
  },
  {
    id: 'draw',
    name: 'BẢNG VẼ TỰ DO',
    icon: '🎨',
    desc: 'Không gian vẽ sáng tạo tự do',
    path: '/draw',
    color: '#fd7e14',
    active: true,
  },
];

export default function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [me, setMe] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  useEffect(() => {
    const fetchMe = async () => {
      if (!token) {
        setMe(null);
        return;
      }

      try {
        setLoadingProfile(true);
        const res = await api.get('/api/auth/me');
        setMe(res.data?.data || null);
      } catch (error) {
        console.error('Lỗi lấy profile ở Home:', error);
        setMe(null);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchMe();
  }, [token]);

  const handlePlay = (path) => {
    navigate(path);

    const currentPlays = parseInt(localStorage.getItem('totalPlays') || '0', 10);
    localStorage.setItem('totalPlays', String(currentPlays + 1));
  };

  return (
    <div
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '32px 20px 48px',
        color: 'var(--text-main)',
      }}
    >
      <section
        style={{
          background: 'linear-gradient(135deg, rgba(132,94,247,0.22), rgba(51,154,240,0.18))',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '18px',
          padding: '28px',
          marginBottom: '28px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.18)',
        }}
      >
        <h1
          style={{
            margin: '0 0 10px 0',
            fontSize: 'clamp(28px, 4vw, 42px)',
            lineHeight: 1.1,
          }}
        >
          🎮 LED MATRIX GAMES
        </h1>

        <p
          style={{
            margin: '0 0 18px 0',
            fontSize: '16px',
            opacity: 0.9,
            lineHeight: 1.7,
            maxWidth: '800px',
          }}
        >
          Hệ thống game web gồm 7 trò chơi, tài khoản người dùng, bạn bè, tin nhắn,
          thành tựu, bảng xếp hạng và khu vực quản trị.
        </p>

        <div
          style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          {!token ? (
            <>
              <button
                onClick={() => navigate('/login')}
                style={primaryBtn}
              >
                Đăng nhập
              </button>

              <button
                onClick={() => navigate('/register')}
                style={secondaryBtn}
              >
                Đăng ký
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/profile')}
                style={primaryBtn}
              >
                {loadingProfile
                  ? 'Đang tải hồ sơ...'
                  : `Xin chào ${me?.full_name || me?.username || 'người chơi'}`}
              </button>

              <button
                onClick={() => navigate('/ranking')}
                style={secondaryBtn}
              >
                Xem ranking
              </button>

              {me?.role === 'admin' && (
                <>
                  <button
                    onClick={() => navigate('/admin')}
                    style={{
                      ...secondaryBtn,
                      border: '1px solid #fa5252',
                    }}
                  >
                    Admin Dashboard
                  </button>

                  <button
                    onClick={() => navigate('/admin/games')}
                    style={{
                      ...secondaryBtn,
                      border: '1px solid #845ef7',
                    }}
                  >
                    Quản lý game
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </section>

      {token && (
        <section style={{ marginBottom: '28px' }}>
          <h2 style={{ marginBottom: '14px' }}>⚡ Điều hướng nhanh</h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '14px',
            }}
          >
            <button style={quickBtn} onClick={() => navigate('/users')}>
              👤 Tìm người dùng
            </button>
            <button style={quickBtn} onClick={() => navigate('/friends')}>
              🤝 Bạn bè
            </button>
            <button style={quickBtn} onClick={() => navigate('/messages')}>
              💬 Tin nhắn
            </button>
            <button style={quickBtn} onClick={() => navigate('/achievements')}>
              🏅 Thành tựu
            </button>
            <button style={quickBtn} onClick={() => navigate('/ranking')}>
              🏆 Bảng xếp hạng
            </button>
            <button style={quickBtn} onClick={() => navigate('/profile')}>
              🙍 Hồ sơ cá nhân
            </button>
          </div>
        </section>
      )}

      <section>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap',
            marginBottom: '16px',
          }}
        >
          <h2 style={{ margin: 0 }}>🕹️ Danh sách trò chơi</h2>
          <span style={{ opacity: 0.8 }}>Tổng cộng: {games.length} game</span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '18px',
          }}
        >
          {games.map((game) => (
            <div
              key={game.id}
              style={{
                borderRadius: '18px',
                padding: '20px',
                background: 'var(--control-bg)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 10px 24px rgba(0,0,0,0.16)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div
                style={{
                  width: '58px',
                  height: '58px',
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '26px',
                  background: game.color,
                  color: '#fff',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.18)',
                }}
              >
                {game.icon}
              </div>

              <div>
                <h3
                  style={{
                    margin: '0 0 8px 0',
                    fontSize: '20px',
                    lineHeight: 1.2,
                  }}
                >
                  {game.name}
                </h3>
                <p
                  style={{
                    margin: 0,
                    opacity: 0.85,
                    lineHeight: 1.6,
                    minHeight: '50px',
                  }}
                >
                  {game.desc}
                </p>
              </div>

              <div style={{ marginTop: 'auto' }}>
                <button
                  onClick={() => handlePlay(game.path)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    color: '#fff',
                    background: game.color,
                    transition: 'transform 0.15s ease',
                  }}
                >
                  Chơi ngay
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const primaryBtn = {
  padding: '12px 18px',
  borderRadius: '10px',
  border: 'none',
  cursor: 'pointer',
  fontWeight: 'bold',
  background: '#339af0',
  color: 'white',
};

const secondaryBtn = {
  padding: '12px 18px',
  borderRadius: '10px',
  border: '1px solid rgba(255,255,255,0.12)',
  cursor: 'pointer',
  fontWeight: 'bold',
  background: 'transparent',
  color: 'var(--text-main)',
};

const quickBtn = {
  padding: '14px 16px',
  borderRadius: '12px',
  border: '1px solid rgba(255,255,255,0.08)',
  cursor: 'pointer',
  fontWeight: 'bold',
  background: 'var(--control-bg)',
  color: 'var(--text-main)',
};