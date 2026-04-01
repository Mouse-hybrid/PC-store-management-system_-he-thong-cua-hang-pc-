import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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