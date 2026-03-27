import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalGames: 0, totalPlays: 0 });
  const [loading, setLoading] = useState(true);
  
  // --- STATE CHO TÌM KIẾM VÀ PHÂN TRANG ---
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 4; // Hiển thị 4 người dùng trên 1 trang cho đẹp
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');

      try {
        const meRes = await axios.get('https://localhost:3636/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (meRes.data.data.role !== 'admin') {
          alert('Từ chối truy cập! Chỉ Quản trị viên mới được vào khu vực này.');
          return navigate('/error', { state: { errorCode: 403 } }); 
        }

        const usersRes = await axios.get('https://localhost:3636/api/auth/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(usersRes.data.data);

        const statsRes = await axios.get('https://localhost:3636/api/auth/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const playCount = parseInt(localStorage.getItem('totalPlays') || '156');

        setStats({
          totalUsers: statsRes.data.totalUsers,
          totalGames: statsRes.data.totalGames,
          totalPlays: playCount
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Lỗi Admin:', error);
        navigate('/login');
      }
    };

    fetchUsers();
  }, [navigate]);

  const handleDelete = async (id, username) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa người dùng [${username}] không? Hành động này không thể hoàn tác!`)) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://localhost:3636/api/auth/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Đã xóa thành công!');
      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      alert(error.response?.data?.message || 'Lỗi khi xóa người dùng!');
    }
  };

  // --- LOGIC XỬ LÝ TÌM KIẾM VÀ PHÂN TRANG ---
  // 1. Lọc danh sách theo từ khóa
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 2. Tính toán phân trang
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Khi người dùng gõ tìm kiếm, phải đưa về trang 1
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  if (loading) return <h2 style={{ color: 'var(--text-main)', textAlign: 'center', marginTop: '50px' }}>Đang tải dữ liệu Quản trị...</h2>;

  return (
    <div style={{ padding: '40px', color: 'var(--text-main)', maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ color: '#fa5252', borderBottom: '2px solid #555', paddingBottom: '10px' }}>
        🛡️ BẢNG ĐIỀU KHIỂN QUẢN TRỊ (ADMIN)
      </h2>

      {/* THẺ THỐNG KÊ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' }}>
        <div style={{ backgroundColor: 'var(--control-bg)', padding: '20px', borderRadius: '10px', textAlign: 'center', borderLeft: '5px solid #339af0', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>
          <div style={{ fontSize: '36px', marginBottom: '10px' }}>👥</div>
          <h3 style={{ margin: '0', fontSize: '28px', color: '#339af0' }}>{stats.totalUsers}</h3>
          <p style={{ margin: '5px 0 0 0', opacity: 0.8, fontWeight: 'bold' }}>TỔNG TÀI KHOẢN</p>
        </div>
        <div style={{ backgroundColor: 'var(--control-bg)', padding: '20px', borderRadius: '10px', textAlign: 'center', borderLeft: '5px solid #fcc419', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>
          <div style={{ fontSize: '36px', marginBottom: '10px' }}>🎮</div>
          <h3 style={{ margin: '0', fontSize: '28px', color: '#fcc419' }}>{stats.totalGames}</h3>
          <p style={{ margin: '5px 0 0 0', opacity: 0.8, fontWeight: 'bold' }}>TỰA GAME HỆ THỐNG</p>
        </div>
        <div style={{ backgroundColor: 'var(--control-bg)', padding: '20px', borderRadius: '10px', textAlign: 'center', borderLeft: '5px solid #40c057', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>
          <div style={{ fontSize: '36px', marginBottom: '10px' }}>🚀</div>
          <h3 style={{ margin: '0', fontSize: '28px', color: '#40c057' }}>{stats.totalPlays}</h3>
          <p style={{ margin: '5px 0 0 0', opacity: 0.8, fontWeight: 'bold' }}>LƯỢT CLICK CHƠI</p>
        </div>
      </div>
      
      {/* DANH SÁCH NGƯỜI DÙNG */}
      <div style={{ backgroundColor: 'var(--control-bg)', borderRadius: '10px', padding: '20px', marginTop: '30px', overflowX: 'auto', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>
        
        {/* --- THANH TÌM KIẾM --- */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #555', paddingBottom: '15px' }}>
          <h3 style={{ margin: 0 }}>📋 Danh sách người dùng</h3>
          <input 
            type="text" 
            placeholder="🔍 Tìm theo Tên hoặc Email..." 
            value={searchTerm}
            onChange={handleSearch}
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #555', width: '250px', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}
          />
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#333', color: '#fcc419' }}>
              <th style={{ padding: '12px' }}>ID</th>
              <th style={{ padding: '12px' }}>Tên đăng nhập</th>
              <th style={{ padding: '12px' }}>Email</th>
              <th style={{ padding: '12px' }}>Vai trò</th>
              <th style={{ padding: '12px' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.length > 0 ? currentUsers.map(user => (
              <tr key={user.id} style={{ borderBottom: '1px solid #555' }}>
                <td style={{ padding: '12px' }}>#{user.id}</td>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>{user.username}</td>
                <td style={{ padding: '12px' }}>{user.email}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{ 
                    padding: '5px 10px', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold', color: 'white',
                    backgroundColor: user.role === 'admin' ? '#fa5252' : (user.role === 'staff' ? '#fcc419' : '#40c057') 
                  }}>
                    {user.role.toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: '12px', display: 'flex', gap: '10px' }}>
                  <button style={{ padding: '6px 12px', backgroundColor: '#339af0', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Sửa</button>
                  <button onClick={() => handleDelete(user.id, user.username)} style={{ padding: '6px 12px', backgroundColor: '#fa5252', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Xóa</button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>Không tìm thấy người dùng nào!</td></tr>
            )}
          </tbody>
        </table>

        {/* --- THANH PHÂN TRANG (PAGINATION) --- */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
            <span style={{ fontSize: '14px', opacity: 0.8 }}>
              Đang xem trang <strong>{currentPage}</strong> / {totalPages}
            </span>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                style={{ padding: '8px 15px', borderRadius: '5px', border: 'none', background: currentPage === 1 ? '#555' : '#339af0', color: 'white', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
              >
                ⬅️ Trước
              </button>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                style={{ padding: '8px 15px', borderRadius: '5px', border: 'none', background: currentPage === totalPages ? '#555' : '#339af0', color: 'white', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
              >
                Sau ➡️
              </button>
            </div>
          </div>
        )}
      </div>
      
      <button onClick={() => navigate('/')} style={{ marginTop: '20px', padding: '10px 20px', background: '#339af0', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px', fontWeight: 'bold' }}>
        🏠 Trở về Sảnh chờ
      </button>
    </div>
  );
};

export default AdminDashboard;