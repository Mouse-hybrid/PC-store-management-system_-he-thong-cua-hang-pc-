<<<<<<< HEAD
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const USERS_PER_PAGE = 4;

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalGames: 0,
    totalPlays: 0,
  });
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchAdminData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);

        const meRes = await api.get('/api/auth/me');
        const me = meRes.data?.data;

        if (me?.role !== 'admin') {
          alert('Từ chối truy cập! Chỉ Quản trị viên mới được vào khu vực này.');
          navigate('/');
          return;
        }

        const [usersRes, statsRes] = await Promise.all([
          api.get('/api/auth/users'),
          api.get('/api/auth/stats'),
        ]);

        const playCount = parseInt(localStorage.getItem('totalPlays') || '0', 10);

        setUsers(usersRes.data?.data || []);
        setStats({
          totalUsers: Number(statsRes.data?.totalUsers || 0),
          totalGames: Number(statsRes.data?.totalGames || 0),
          totalPlays: playCount,
        });
      } catch (error) {
        console.error('Lỗi AdminDashboard:', error);

        const status = error?.response?.status;
        if (status === 401 || status === 403) {
          alert(error?.response?.data?.message || 'Bạn không có quyền truy cập khu vực admin.');
          navigate('/login');
          return;
        }

        alert('Không thể tải dữ liệu quản trị.');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [navigate]);

  const handleDelete = async (id, username) => {
    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn xóa người dùng [${username}] không? Hành động này không thể hoàn tác!`
    );
    if (!confirmed) return;

    try {
      await api.delete(`/api/auth/users/${id}`);

      setUsers((prev) => prev.filter((user) => user.id !== id));
      setStats((prev) => ({
        ...prev,
        totalUsers: Math.max(prev.totalUsers - 1, 0),
      }));

      alert('Đã xóa thành công!');
    } catch (error) {
      console.error('Lỗi xóa user:', error);
      alert(error?.response?.data?.message || 'Lỗi khi xóa người dùng!');
    }
  };

  const filteredUsers = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return users;

    return users.filter((user) =>
      [user.username, user.email, user.full_name]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(q))
    );
  }, [users, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / USERS_PER_PAGE));
  const indexOfLastUser = currentPage * USERS_PER_PAGE;
  const indexOfFirstUser = indexOfLastUser - USERS_PER_PAGE;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

=======
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
>>>>>>> 90174cc82f987f11ca3971b1252da19457ca1cf4
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

<<<<<<< HEAD
  if (loading) {
    return (
      <h2 style={{ color: 'var(--text-main)', textAlign: 'center', marginTop: '50px' }}>
        Đang tải dữ liệu Quản trị...
      </h2>
    );
  }

  return (
    <div style={{ padding: '40px', color: 'var(--text-main)', maxWidth: '1100px', margin: '0 auto' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap',
          borderBottom: '2px solid #555',
          paddingBottom: '10px',
        }}
      >
        <h2 style={{ color: '#fa5252', margin: 0 }}>🛡️ BẢNG ĐIỀU KHIỂN QUẢN TRỊ (ADMIN)</h2>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/admin/games')}
            style={topButton('#845ef7')}
          >
            🎮 Quản lý Game
          </button>

          <button
            onClick={() => navigate('/')}
            style={topButton('#339af0')}
          >
            🏠 Trở về Sảnh chờ
          </button>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginTop: '20px',
        }}
      >
        <StatCard icon="👥" color="#339af0" value={stats.totalUsers} label="TỔNG TÀI KHOẢN" />
        <StatCard icon="🎮" color="#fcc419" value={stats.totalGames} label="TỰA GAME HỆ THỐNG" />
        <StatCard icon="🚀" color="#40c057" value={stats.totalPlays} label="LƯỢT CLICK CHƠI" />
      </div>

      <div
        style={{
          marginTop: '18px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '12px',
        }}
      >
        <button
          onClick={() => navigate('/admin/games')}
          style={quickButton('#845ef7', 'rgba(132, 94, 247, 0.12)')}
        >
          ⚙️ Đi tới trang Quản lý Game
        </button>

        <button
          onClick={() => navigate('/ranking')}
          style={quickButton('#fcc419', 'rgba(252, 196, 25, 0.12)')}
        >
          🏆 Xem Ranking hệ thống
        </button>
      </div>

      <div
        style={{
          backgroundColor: 'var(--control-bg)',
          borderRadius: '10px',
          padding: '20px',
          marginTop: '30px',
          overflowX: 'auto',
          boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            borderBottom: '1px solid #555',
            paddingBottom: '15px',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          <h3 style={{ margin: 0 }}>📋 Danh sách người dùng</h3>

          <input
            type="text"
            placeholder="🔍 Tìm theo tên, email, username..."
            value={searchTerm}
            onChange={handleSearch}
            style={{
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #555',
              width: '280px',
              backgroundColor: 'var(--bg-main)',
              color: 'var(--text-main)',
            }}
=======
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
>>>>>>> 90174cc82f987f11ca3971b1252da19457ca1cf4
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
<<<<<<< HEAD
            {currentUsers.length > 0 ? (
              currentUsers.map((user) => (
                <tr key={user.id} style={{ borderBottom: '1px solid #555' }}>
                  <td style={{ padding: '12px' }}>#{user.id}</td>
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>{user.username}</td>
                  <td style={{ padding: '12px' }}>{user.email}</td>
                  <td style={{ padding: '12px' }}>
                    <span
                      style={{
                        padding: '5px 10px',
                        borderRadius: '15px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color: user.role === 'staff' ? '#111' : 'white',
                        backgroundColor:
                          user.role === 'admin'
                            ? '#fa5252'
                            : user.role === 'staff'
                            ? '#fcc419'
                            : '#40c057',
                      }}
                    >
                      {String(user.role || 'user').toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '12px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => navigate('/admin/games')}
                      style={rowButton('#845ef7')}
                    >
                      Game
                    </button>

                    <button
                      onClick={() => handleDelete(user.id, user.username)}
                      style={rowButton('#fa5252')}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                  Không tìm thấy người dùng nào!
                </td>
              </tr>
=======
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
>>>>>>> 90174cc82f987f11ca3971b1252da19457ca1cf4
            )}
          </tbody>
        </table>

<<<<<<< HEAD
        {totalPages > 1 && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '20px',
              gap: '12px',
              flexWrap: 'wrap',
            }}
          >
            <span style={{ fontSize: '14px', opacity: 0.8 }}>
              Đang xem trang <strong>{currentPage}</strong> / {totalPages}
            </span>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                style={pageButton(currentPage === 1)}
              >
                ⬅️ Trước
              </button>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                style={pageButton(currentPage === totalPages)}
=======
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
>>>>>>> 90174cc82f987f11ca3971b1252da19457ca1cf4
              >
                Sau ➡️
              </button>
            </div>
          </div>
        )}
      </div>
<<<<<<< HEAD
    </div>
  );
}

function StatCard({ icon, color, value, label }) {
  return (
    <div
      style={{
        backgroundColor: 'var(--control-bg)',
        padding: '20px',
        borderRadius: '10px',
        textAlign: 'center',
        borderLeft: `5px solid ${color}`,
        boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
      }}
    >
      <div style={{ fontSize: '36px', marginBottom: '10px' }}>{icon}</div>
      <h3 style={{ margin: '0', fontSize: '28px', color }}>{value}</h3>
      <p style={{ margin: '5px 0 0 0', opacity: 0.8, fontWeight: 'bold' }}>{label}</p>
    </div>
  );
}

function topButton(bg) {
  return {
    padding: '10px 16px',
    background: bg,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
  };
}

function quickButton(borderColor, background) {
  return {
    padding: '14px 16px',
    borderRadius: '10px',
    border: `1px solid ${borderColor}`,
    background,
    color: 'var(--text-main)',
    cursor: 'pointer',
    fontWeight: 'bold',
  };
}

function rowButton(bg) {
  return {
    padding: '6px 12px',
    backgroundColor: bg,
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
  };
}

function pageButton(disabled) {
  return {
    padding: '8px 15px',
    borderRadius: '5px',
    border: 'none',
    background: disabled ? '#555' : '#339af0',
    color: 'white',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontWeight: 'bold',
  };
}
=======
      
      <button onClick={() => navigate('/')} style={{ marginTop: '20px', padding: '10px 20px', background: '#339af0', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px', fontWeight: 'bold' }}>
        🏠 Trở về Sảnh chờ
      </button>
    </div>
  );
};

export default AdminDashboard;
>>>>>>> 90174cc82f987f11ca3971b1252da19457ca1cf4
