import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://localhost:3636/api/auth/login', {
        email,
        password
      });
      localStorage.setItem('token', response.data.data.token);
      alert('Đăng nhập thành công!');
      navigate('/'); 
    } catch (err) {
      setError('Sai email hoặc mật khẩu. Vui lòng thử lại!');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: 'var(--text-main)' }}>

      <form onSubmit={handleLogin} style={{ background: 'var(--board-bg)', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', width: '100%', maxWidth: '350px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '20px', letterSpacing: '2px' }}>ĐĂNG NHẬP</h2>
        {error && <p style={{ color: '#fa5252', marginBottom: '15px', fontSize: '0.9rem' }}>{error}</p>}
        <input type="email" placeholder="Email của bạn" required value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ccc' }} />
        <input type="password" placeholder="Mật khẩu" required value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #ccc' }} />
        <button type="submit" style={{ width: '100%', padding: '12px', background: '#339af0', color: 'white', fontWeight: 'bold', fontSize: '1rem', border: 'none', borderRadius: '8px' }}>VÀO HỆ THỐNG</button>
      </form>
    </div>
  );
};

export default Login;