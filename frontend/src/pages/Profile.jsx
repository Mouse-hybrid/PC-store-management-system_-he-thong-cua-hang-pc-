import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import api from '../utils/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:3636';

function resolveAvatarUrl(url) {
  if (!url) return 'https://placehold.co/120x120?text=Avatar';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${API_BASE_URL}${url}`;
}

export default function Profile() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [profile, setProfile] = useState({
    id: '',
    username: '',
    full_name: '',
    email: '',
    role: '',
    avatar_url: '',
  });

  const [profileForm, setProfileForm] = useState({
    username: '',
    full_name: '',
    email: '',
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const fetchMe = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/auth/me');
      const me = res.data?.data;

      if (!me) {
        throw new Error('Không lấy được thông tin người dùng.');
      }

      setProfile(me);
      setProfileForm({
        username: me.username || '',
        full_name: me.full_name || '',
        email: me.email || '',
      });
    } catch (error) {
      console.error('Lỗi lấy hồ sơ:', error);
      alert('Bạn cần đăng nhập để xem hồ sơ.');
      localStorage.removeItem('token');
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  const handleProfileChange = (e) => {
    setProfileForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePasswordChange = (e) => {
    setPasswordForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (!profileForm.username.trim()) {
      alert('Username không được để trống.');
      return;
    }

    if (!profileForm.full_name.trim()) {
      alert('Họ tên không được để trống.');
      return;
    }

    if (!profileForm.email.trim()) {
      alert('Email không được để trống.');
      return;
    }

    try {
      setSavingProfile(true);

      await api.put('/api/auth/update-profile', {
        username: profileForm.username.trim(),
        full_name: profileForm.full_name.trim(),
        email: profileForm.email.trim(),
      });

      alert('Cập nhật hồ sơ thành công!');
      await fetchMe();
    } catch (error) {
      console.error('Lỗi cập nhật hồ sơ:', error);
      alert(error?.response?.data?.message || 'Không thể cập nhật hồ sơ.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append('avatar', file);

      await api.post('/api/auth/upload-avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Upload avatar thành công!');
      await fetchMe();
    } catch (error) {
      console.error('Lỗi upload avatar:', error);
      alert(error?.response?.data?.message || 'Không thể upload avatar.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!passwordForm.oldPassword || !passwordForm.newPassword || !passwordForm.confirmNewPassword) {
      alert('Vui lòng nhập đầy đủ thông tin đổi mật khẩu.');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      alert('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      alert('Mật khẩu mới nhập lại không khớp.');
      return;
    }

    try {
      setChangingPassword(true);

      await api.put('/api/auth/change-password', {
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      });

      alert('Đổi mật khẩu thành công!');
      setPasswordForm({
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    } catch (error) {
      console.error('Lỗi đổi mật khẩu:', error);
      alert(error?.response?.data?.message || 'Không thể đổi mật khẩu.');
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div style={centerWrap}>
        <h2 style={{ color: 'var(--text-main)' }}>Đang tải hồ sơ...</h2>
      </div>
    );
  }

  return (
    <div style={pageWrap}>
      <div style={headerCard}>
        <div style={{ display: 'flex', gap: '18px', alignItems: 'center', flexWrap: 'wrap' }}>
          <img
            src={resolveAvatarUrl(profile.avatar_url)}
            alt="avatar"
            style={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid rgba(255,255,255,0.15)',
            }}
          />

          <div>
            <h1 style={{ margin: '0 0 8px 0' }}>
              {profile.full_name || profile.username}
            </h1>
            <p style={{ margin: '0 0 6px 0', opacity: 0.85 }}>@{profile.username}</p>
            <p style={{ margin: '0 0 6px 0', opacity: 0.85 }}>{profile.email}</p>
            <span
              style={{
                display: 'inline-block',
                padding: '6px 12px',
                borderRadius: '999px',
                fontWeight: 'bold',
                background:
                  profile.role === 'admin'
                    ? '#fa5252'
                    : profile.role === 'staff'
                    ? '#fcc419'
                    : '#40c057',
                color: profile.role === 'staff' ? '#111' : '#fff',
              }}
            >
              {String(profile.role || 'user').toUpperCase()}
            </span>
          </div>
        </div>

        <div style={{ marginTop: 18 }}>
          <label style={uploadBtn}>
            {uploading ? 'Đang upload...' : 'Chọn avatar mới'}
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              hidden
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      <div style={gridWrap}>
        <section style={card}>
          <h2 style={sectionTitle}>Cập nhật hồ sơ</h2>

          <form onSubmit={handleUpdateProfile} style={{ display: 'grid', gap: 14 }}>
            <div>
              <label htmlFor="username" style={labelStyle}>Username</label>
              <input
                id="username"
                name="username"
                value={profileForm.username}
                onChange={handleProfileChange}
                style={inputStyle}
              />
            </div>

            <div>
              <label htmlFor="full_name" style={labelStyle}>Họ và tên</label>
              <input
                id="full_name"
                name="full_name"
                value={profileForm.full_name}
                onChange={handleProfileChange}
                style={inputStyle}
              />
            </div>

            <div>
              <label htmlFor="email" style={labelStyle}>Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={profileForm.email}
                onChange={handleProfileChange}
                style={inputStyle}
              />
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              style={{
                ...primaryBtn,
                background: savingProfile ? '#74c0fc' : '#339af0',
              }}
            >
              {savingProfile ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </form>
        </section>

        <section style={card}>
          <h2 style={sectionTitle}>Đổi mật khẩu</h2>

          <form onSubmit={handleChangePassword} style={{ display: 'grid', gap: 14 }}>
            <div>
              <label htmlFor="oldPassword" style={labelStyle}>Mật khẩu cũ</label>
              <input
                id="oldPassword"
                name="oldPassword"
                type="password"
                value={passwordForm.oldPassword}
                onChange={handlePasswordChange}
                style={inputStyle}
              />
            </div>

            <div>
              <label htmlFor="newPassword" style={labelStyle}>Mật khẩu mới</label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                style={inputStyle}
              />
            </div>

            <div>
              <label htmlFor="confirmNewPassword" style={labelStyle}>Nhập lại mật khẩu mới</label>
              <input
                id="confirmNewPassword"
                name="confirmNewPassword"
                type="password"
                value={passwordForm.confirmNewPassword}
                onChange={handlePasswordChange}
                style={inputStyle}
              />
            </div>

            <button
              type="submit"
              disabled={changingPassword}
              style={{
                ...primaryBtn,
                background: changingPassword ? '#ff8787' : '#fa5252',
              }}
            >
              {changingPassword ? 'Đang đổi mật khẩu...' : 'Đổi mật khẩu'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

const centerWrap = {
  minHeight: 'calc(100vh - 140px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const pageWrap = {
  maxWidth: 1100,
  margin: '0 auto',
  padding: '30px 20px 48px',
  color: 'var(--text-main)',
};

const headerCard = {
  background: 'var(--control-bg)',
  borderRadius: 18,
  padding: 24,
  border: '1px solid rgba(255,255,255,0.08)',
  boxShadow: '0 10px 28px rgba(0,0,0,0.18)',
  marginBottom: 22,
};

const gridWrap = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
  gap: 20,
  marginBottom: 22,
};

const card = {
  background: 'var(--control-bg)',
  borderRadius: 18,
  padding: 24,
  border: '1px solid rgba(255,255,255,0.08)',
  boxShadow: '0 10px 28px rgba(0,0,0,0.18)',
};

const sectionTitle = {
  marginTop: 0,
  marginBottom: 16,
};

const labelStyle = {
  display: 'block',
  marginBottom: 8,
  fontWeight: 'bold',
};

const inputStyle = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '12px 14px',
  borderRadius: 10,
  border: '1px solid rgba(255,255,255,0.12)',
  background: 'var(--bg-main)',
  color: 'var(--text-main)',
  outline: 'none',
};

const primaryBtn = {
  padding: '12px 16px',
  border: 'none',
  borderRadius: 10,
  cursor: 'pointer',
  fontWeight: 'bold',
  color: '#fff',
};

const uploadBtn = {
  display: 'inline-block',
  padding: '10px 14px',
  borderRadius: 10,
  background: '#845ef7',
  color: '#fff',
  fontWeight: 'bold',
  cursor: 'pointer',
};
=======
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
>>>>>>> 90174cc82f987f11ca3971b1252da19457ca1cf4
