import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // State cho Đổi Tên
  const [isEditing, setIsEditing] = useState(false);
  const [editFullName, setEditFullName] = useState('');

  // State cho Đổi Mật Khẩu
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [passwords, setPasswords] = useState({ oldPass: '', newPass: '', confirmPass: '' });
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, [navigate]);

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');
    try {
      const res = await axios.get('https://localhost:3636/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data.data); 
      setEditFullName(res.data.data.full_name || '');
      setLoading(false);
    } catch (error) {
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('avatar', file); 
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('https://localhost:3636/api/auth/upload-avatar', formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      alert(res.data.message);
      fetchProfile(); 
    } catch (error) {
      alert("Lỗi khi tải ảnh lên!");
    }
  };

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('https://localhost:3636/api/auth/update-profile', 
        { full_name: editFullName }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Cập nhật thông tin thành công!");
      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      alert(error.response?.data?.message || "Lỗi cập nhật!");
    }
  };

  // --- HÀM XỬ LÝ ĐỔI MẬT KHẨU ---
  const handlePasswordSubmit = async () => {
    if (!passwords.oldPass || !passwords.newPass || !passwords.confirmPass) {
      return alert("Vui lòng điền đầy đủ các ô mật khẩu!");
    }
    if (passwords.newPass !== passwords.confirmPass) {
      return alert("Mật khẩu mới và xác nhận không khớp!");
    }
    
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put('https://localhost:3636/api/auth/change-password', 
        { oldPassword: passwords.oldPass, newPassword: passwords.newPass },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.message);
      // Reset form sau khi đổi thành công
      setIsChangingPass(false);
      setPasswords({ oldPass: '', newPass: '', confirmPass: '' });
    } catch (error) {
      alert(error.response?.data?.message || "Lỗi khi đổi mật khẩu!");
    }
  };

  if (loading) return <h2 style={{ color: 'var(--text-main)', textAlign: 'center', marginTop: '50px' }}>Đang tải dữ liệu...</h2>;

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', padding: '30px', backgroundColor: 'var(--control-bg)', borderRadius: '10px', color: 'var(--text-main)', boxShadow: '0 4px 15px rgba(0,0,0,0.5)' }}>
      <h2 style={{ textAlign: 'center', color: '#fcc419', marginBottom: '20px', letterSpacing: '2px' }}>HỒ SƠ CÁ NHÂN</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
        <img 
          src={user.avatar_url ? `https://localhost:3636${user.avatar_url}` : "https://via.placeholder.com/100"} 
          alt="Avatar" 
          style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #339af0', marginBottom: '10px' }}
        />
        <label style={{ cursor: 'pointer', background: '#333', color: 'white', padding: '5px 15px', borderRadius: '5px', fontSize: '14px' }}>
          Đổi ảnh đại diện
          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
        </label>
      </div>
      
      <div style={{ fontSize: '16px', lineHeight: '2.5', backgroundColor: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '8px' }}>
        <div style={{ borderBottom: '1px solid #555' }}><strong>👤 Tên đăng nhập:</strong> <span style={{ float: 'right' }}>{user.username}</span></div>
        
        <div style={{ borderBottom: '1px solid #555', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <strong>📝 Họ và tên:</strong> 
          {isEditing ? (
            <div style={{ display: 'flex', gap: '5px' }}>
              <input type="text" value={editFullName} onChange={(e) => setEditFullName(e.target.value)} style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc', width: '150px' }} />
              <button onClick={handleSaveProfile} style={{ background: '#40c057', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '5px 10px' }}>Lưu</button>
              <button onClick={() => setIsEditing(false)} style={{ background: '#fa5252', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '5px 10px' }}>Hủy</button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span>{user.full_name || 'Chưa cập nhật'}</span>
              <button onClick={() => setIsEditing(true)} style={{ background: 'transparent', border: '1px solid var(--text-main)', color: 'var(--text-main)', borderRadius: '4px', cursor: 'pointer', padding: '2px 8px', fontSize: '12px' }}>Sửa</button>
            </div>
          )}
        </div>

        <div style={{ borderBottom: '1px solid #555' }}><strong>📧 Email:</strong> <span style={{ float: 'right' }}>{user.email}</span></div>
        <div style={{ borderBottom: '1px solid #555' }}><strong>⭐ Vai trò:</strong> 
          <span style={{ float: 'right', color: user.role === 'admin' ? '#fa5252' : '#40c057', fontWeight: 'bold' }}>
            {user.role === 'admin' ? 'Quản trị viên (Admin)' : 'Người chơi'}
          </span>
        </div>

        {/* --- KHU VỰC ĐỔI MẬT KHẨU --- */}
        <div style={{ marginTop: '10px' }}>
          {!isChangingPass ? (
            <button onClick={() => setIsChangingPass(true)} style={{ width: '100%', padding: '8px', background: 'transparent', border: '1px dashed var(--text-main)', color: 'var(--text-main)', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
              🔑 Đổi mật khẩu
            </button>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px', padding: '15px', backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: '8px', border: '1px solid #555' }}>
              <input type="password" placeholder="Mật khẩu cũ" value={passwords.oldPass} onChange={(e) => setPasswords({...passwords, oldPass: e.target.value})} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
              <input type="password" placeholder="Mật khẩu mới (ít nhất 6 ký tự)" value={passwords.newPass} onChange={(e) => setPasswords({...passwords, newPass: e.target.value})} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
              <input type="password" placeholder="Xác nhận mật khẩu mới" value={passwords.confirmPass} onChange={(e) => setPasswords({...passwords, confirmPass: e.target.value})} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={handlePasswordSubmit} style={{ flex: 1, padding: '8px', background: '#40c057', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Lưu mật khẩu</button>
                <button onClick={() => { setIsChangingPass(false); setPasswords({ oldPass: '', newPass: '', confirmPass: '' }); }} style={{ flex: 1, padding: '8px', background: '#fa5252', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Hủy bỏ</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {user.role === 'admin' && (
        <button onClick={() => navigate('/admin')} style={{ width: '100%', padding: '12px', marginTop: '25px', backgroundColor: '#fa5252', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          ⚙️ Bảng Điều Khiển Quản Trị
        </button>
      )}
      <button onClick={() => navigate('/')} style={{ width: '100%', padding: '12px', marginTop: '15px', backgroundColor: '#339af0', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
        🏠 Quay lại Sảnh chờ
      </button>
    </div>
  );
};

export default Profile;