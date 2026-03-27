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
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
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
        >
          {theme === 'light' ? <Sun size={20} color="#fcc419" /> : <Moon size={20} color="#f0f0f0" />}
        </button>

        {token ? (
          <>
            <button onClick={() => navigate('/profile')} style={{ padding: '8px 15px', borderRadius: '5px', border: 'none', background: '#fcc419', fontWeight: 'bold', cursor: 'pointer' }}>Hồ sơ</button>
            <button onClick={handleLogout} style={{ padding: '8px 15px', borderRadius: '5px', border: 'none', background: '#fa5252', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>Đăng xuất</button>
            
          </>
        ) : (
          <>
            <Link to="/login" style={{ padding: '8px 15px', borderRadius: '5px', textDecoration: 'none', background: '#339af0', color: 'white', fontWeight: 'bold' }}>Đăng nhập</Link>
            <Link to="/register" style={{ padding: '8px 15px', borderRadius: '5px', textDecoration: 'none', background: '#40c057', color: 'white', fontWeight: 'bold' }}>Đăng ký</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;