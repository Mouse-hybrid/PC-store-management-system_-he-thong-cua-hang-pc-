<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Sun, Moon } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:3636';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const savedTheme = localStorage.getItem('theme') || 'light';
  const [theme, setTheme] = useState(savedTheme);
  const [me, setMe] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const fetchMe = async () => {
      if (!token) {
        setMe(null);
        return;
      }

      try {
        const res = await axios.get(`${API_BASE_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMe(res.data.data);
      } catch (error) {
        console.error('Lỗi lấy profile ở Navbar:', error);
        setMe(null);
      }
    };

    fetchMe();
  }, [token]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
=======
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// Nhúng thư viện biểu tượng (bạn cần chạy 'npm install lucide-react' nếu chưa cài)
import { Sun, Moon } from 'lucide-react'; 

const Navbar = () => {
  const navigate = useNavigate();
  // Kiểm tra trạng thái đăng nhập
  const token = localStorage.getItem('token');

  // --- LOGIC ĐỔI MÀU (DARK MODE) ---
  // Lấy trạng thái màu cũ từ trình duyệt (hoặc mặc định là light)
  const savedTheme = localStorage.getItem('theme') || 'light';
  const [theme, setTheme] = useState(savedTheme);

  // Áp dụng màu lên thẻ <html> mỗi khi theme thay đổi
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme); // Lưu preference của người dùng
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
>>>>>>> 90174cc82f987f11ca3971b1252da19457ca1cf4
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
<<<<<<< HEAD
    alert('Đã đăng xuất!');
    navigate('/');
    window.location.reload();
  };

  const navBtn = {
    padding: '8px 14px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: 'bold',
    border: 'none',
    cursor: 'pointer',
    color: 'white',
    fontSize: '14px',
  };

  const textBtn = {
    padding: '8px 12px',
    borderRadius: '8px',
    textDecoration: 'none',
    color: 'var(--text-main)',
    fontWeight: 'bold',
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.12)',
  };

  return (
    <nav
      style={{
        width: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        justifyContent: 'space-between',
        padding: '15px 24px',
        backgroundColor: 'var(--navbar-bg)',
        color: 'var(--text-main)',
        alignItems: 'center',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        gap: '16px',
        flexWrap: 'wrap',
      }}
    >
      <div
        onClick={() => navigate('/')}
        style={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          gap: '10px',
        }}
        title="Về Trang Chủ"
      >
        <span style={{ color: '#845ef7', fontSize: '24px' }}>🎮</span>
        <h1
          style={{
            margin: 0,
            fontSize: '20px',
            fontWeight: 'bold',
            color: 'var(--text-main)',
            letterSpacing: '1px',
          }}
        >
          LED MATRIX GAMES
        </h1>
      </div>

      {token && (
        <div
          style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            flexWrap: 'wrap',
            justifyContent: 'center',
            flex: 1,
          }}
        >
          <Link to="/" style={textBtn}>Sảnh chờ</Link>
          <Link to="/ranking" style={textBtn}>Ranking</Link>
          <Link to="/friends" style={textBtn}>Friends</Link>
          <Link to="/messages" style={textBtn}>Messages</Link>
          <Link to="/achievements" style={textBtn}>Achievements</Link>

          {me?.role === 'admin' && (
            <>
              <Link to="/admin" style={{ ...textBtn, border: '1px solid #fa5252' }}>Admin</Link>
              <Link to="/admin/games" style={{ ...textBtn, border: '1px solid #845ef7' }}>
                Admin Games
              </Link>
            </>
          )}
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={toggleTheme}
          title={`Chuyển sang ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          style={{
            padding: '8px',
            borderRadius: '50%',
            border: '1px solid var(--text-main)',
            background: 'transparent',
            cursor: 'pointer',
            display: 'flex',
          }}
=======
    alert("Đã đăng xuất!");
    navigate('/');
    window.location.reload(); 
  };

  return (
    <nav style={{ width: '100%', boxSizing: 'border-box', display: 'flex', justifyContent: 'space-between', padding: '15px 30px', backgroundColor: 'var(--navbar-bg)', color: 'var(--text-main)', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
      <div style={{ fontWeight: 'bold', fontSize: '1.2rem', letterSpacing: '2px', cursor: 'pointer' }} onClick={() => navigate('/')}>
        <div 
          onClick={() => navigate('/')} 
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '10px' }}
          title="Về Trang Chủ"
        >
          {/* use logo as back button home */}
          <span style={{ color: '#845ef7', fontSize: '24px' }}>🎮</span>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: 'var(--text-main)', letterSpacing: '1px' }}>
            LED MATRIX GAMES
          </h1>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
        {/* --- NÚT BẤM ĐỔI MÀU (MỚI THÊM) --- */}
        <button 
          onClick={toggleTheme} 
          title={`Chuyển sang ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          style={{ padding: '8px', borderRadius: '50%', border: '1px solid var(--text-main)', background: 'transparent', cursor: 'pointer', display: 'flex' }}
>>>>>>> 90174cc82f987f11ca3971b1252da19457ca1cf4
        >
          {theme === 'light' ? <Sun size={20} color="#fcc419" /> : <Moon size={20} color="#f0f0f0" />}
        </button>

        {token ? (
          <>
<<<<<<< HEAD
            <button
              onClick={() => navigate('/profile')}
              style={{ ...navBtn, background: '#fcc419', color: '#111' }}
            >
              {me?.full_name || 'Hồ sơ'}
            </button>

            <button
              onClick={handleLogout}
              style={{ ...navBtn, background: '#fa5252' }}
            >
              Đăng xuất
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ ...navBtn, background: '#339af0' }}>
              Đăng nhập
            </Link>
            <Link to="/register" style={{ ...navBtn, background: '#40c057' }}>
              Đăng ký
            </Link>
=======
            <button onClick={() => navigate('/profile')} style={{ padding: '8px 15px', borderRadius: '5px', border: 'none', background: '#fcc419', fontWeight: 'bold', cursor: 'pointer' }}>Hồ sơ</button>
            <button onClick={handleLogout} style={{ padding: '8px 15px', borderRadius: '5px', border: 'none', background: '#fa5252', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>Đăng xuất</button>
            
          </>
        ) : (
          <>
            <Link to="/login" style={{ padding: '8px 15px', borderRadius: '5px', textDecoration: 'none', background: '#339af0', color: 'white', fontWeight: 'bold' }}>Đăng nhập</Link>
            <Link to="/register" style={{ padding: '8px 15px', borderRadius: '5px', textDecoration: 'none', background: '#40c057', color: 'white', fontWeight: 'bold' }}>Đăng ký</Link>
>>>>>>> 90174cc82f987f11ca3971b1252da19457ca1cf4
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;