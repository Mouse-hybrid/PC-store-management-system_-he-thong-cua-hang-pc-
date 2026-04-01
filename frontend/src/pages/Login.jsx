import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email.trim() || !form.password.trim()) {
      alert('Vui lòng nhập đầy đủ email và mật khẩu.');
      return;
    }

    try {
      setLoading(true);

      const loginRes = await api.post('/api/auth/login', {
        email: form.email.trim(),
        password: form.password,
      });

      const token = loginRes.data?.data?.token;
      if (!token) {
        throw new Error('Không nhận được token đăng nhập.');
      }

      localStorage.setItem('token', token);

      const meRes = await api.get('/api/auth/me');
      const me = meRes.data?.data;

      alert('Đăng nhập thành công!');

      if (me?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      localStorage.removeItem('token');

      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Đăng nhập thất bại, vui lòng thử lại.';

      alert(message);
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
          maxWidth: '460px',
          background: 'var(--control-bg)',
          color: 'var(--text-main)',
          borderRadius: '18px',
          padding: '28px',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 10px 28px rgba(0,0,0,0.18)',
        }}
      >
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <h1 style={{ margin: '0 0 10px 0' }}>🔐 Đăng nhập</h1>
          <p style={{ margin: 0, opacity: 0.8 }}>
            Truy cập hệ thống game web và các chức năng người dùng.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '14px' }}>
          <div>
            <label
              htmlFor="email"
              style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: 'bold',
              }}
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Nhập email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              style={inputStyle}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: 'bold',
              }}
            >
              Mật khẩu
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Nhập mật khẩu"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
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
              background: loading ? '#74c0fc' : '#339af0',
              color: 'white',
              opacity: loading ? 0.8 : 1,
            }}
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        <div
          style={{
            marginTop: '18px',
            textAlign: 'center',
            opacity: 0.9,
          }}
        >
          Chưa có tài khoản?{' '}
          <Link
            to="/register"
            style={{
              color: '#4dabf7',
              fontWeight: 'bold',
              textDecoration: 'none',
            }}
          >
            Đăng ký ngay
          </Link>
        </div>

        <div
          style={{
            marginTop: '20px',
            padding: '14px',
            borderRadius: '10px',
            background: 'rgba(255,255,255,0.04)',
            fontSize: '14px',
            lineHeight: 1.7,
          }}
        >
          <strong>Gợi ý test:</strong>
          <br />
          - Admin: đăng nhập để vào Dashboard và Quản lý game
          <br />
          - User: đăng nhập để dùng Friends, Messages, Ranking, Achievements
        </div>
      </div>
    </div>
  );
}

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