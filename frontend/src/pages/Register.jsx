import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '',
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    if (!form.username.trim()) {
      alert('Vui lòng nhập username.');
      return false;
    }

    if (!form.full_name.trim()) {
      alert('Vui lòng nhập họ tên.');
      return false;
    }

    if (!form.email.trim()) {
      alert('Vui lòng nhập email.');
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(form.email.trim())) {
      alert('Email không hợp lệ.');
      return false;
    }

    if (!form.password || form.password.length < 6) {
      alert('Mật khẩu phải có ít nhất 6 ký tự.');
      return false;
    }

    if (form.password !== form.confirmPassword) {
      alert('Mật khẩu nhập lại không khớp.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      await api.post('/api/auth/register', {
        username: form.username.trim(),
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      alert('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } catch (error) {
      console.error('Lỗi đăng ký:', error);
      alert(
        error?.response?.data?.message ||
          'Đăng ký thất bại. Vui lòng kiểm tra lại dữ liệu.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 140px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          background: 'var(--control-bg)',
          color: 'var(--text-main)',
          borderRadius: '18px',
          padding: '28px',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 10px 28px rgba(0,0,0,0.18)',
        }}
      >
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <h1 style={{ margin: '0 0 10px 0' }}>📝 Đăng ký tài khoản</h1>
          <p style={{ margin: 0, opacity: 0.8 }}>
            Tạo tài khoản để chơi game, kết bạn, nhắn tin và lưu tiến độ.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '14px' }}>
          <div>
            <label htmlFor="username" style={labelStyle}>Username</label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Nhập username"
              value={form.username}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div>
            <label htmlFor="full_name" style={labelStyle}>Họ và tên</label>
            <input
              id="full_name"
              name="full_name"
              type="text"
              placeholder="Nhập họ tên"
              value={form.full_name}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div>
            <label htmlFor="email" style={labelStyle}>Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Nhập email"
              value={form.email}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div>
            <label htmlFor="password" style={labelStyle}>Mật khẩu</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Nhập mật khẩu"
              value={form.password}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" style={labelStyle}>Nhập lại mật khẩu</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Nhập lại mật khẩu"
              value={form.confirmPassword}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '8px',
              padding: '12px 16px',
              border: 'none',
              borderRadius: '10px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              background: loading ? '#69db7c' : '#40c057',
              color: 'white',
              opacity: loading ? 0.85 : 1,
            }}
          >
            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </button>
        </form>

        <div
          style={{
            marginTop: '18px',
            textAlign: 'center',
            opacity: 0.9,
          }}
        >
          Đã có tài khoản?{' '}
          <Link
            to="/login"
            style={{
              color: '#4dabf7',
              fontWeight: 'bold',
              textDecoration: 'none',
            }}
          >
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    </div>
  );
}

const labelStyle = {
  display: 'block',
  marginBottom: '8px',
  fontWeight: 'bold',
};

const inputStyle = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '12px 14px',
  borderRadius: '10px',
  border: '1px solid rgba(255,255,255,0.12)',
  background: 'var(--bg-main)',
  color: 'var(--text-main)',
  outline: 'none',
};