import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        return setError("Email không đúng định dạng (ví dụ: abc@gmail.com)!");
    }

    // 2. Kiểm tra độ dài mật khẩu (Yêu cầu đồ án) 
    if (formData.password.length < 6) {
        return setError("Mật khẩu phải có ít nhất 6 ký tự!");
    }

    // 3. Kiểm tra khớp mật khẩu
    if (formData.password !== formData.confirmPassword) {
        return setError("Mật khẩu nhập lại không khớp!");
    }
    
    try {
      await axios.post('https://localhost:3636/api/auth/register', {
        username: formData.name,   // Sửa chữ 'name' thành 'username'
        full_name: formData.name,  // Thêm dòng này để lưu tên đầy đủ
        email: formData.email,
        password: formData.password
      });
      alert('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } catch (err) {
      setError('Đăng ký thất bại. Email có thể đã tồn tại.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: 'var(--text-main)' }}>

      <form onSubmit={handleRegister} style={{ background: 'var(--board-bg)', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', width: '100%', maxWidth: '350px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '20px', letterSpacing: '2px' }}>ĐĂNG KÝ</h2>
        {error && <p style={{ color: '#fa5252', marginBottom: '15px', fontSize: '0.9rem' }}>{error}</p>}
        <input type="text" placeholder="Tên hiển thị" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ccc' }} />
        <input type="email" placeholder="Email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ccc' }} />
        <input type="password" placeholder="Mật khẩu" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ccc' }} />
        <input type="password" placeholder="Nhập lại mật khẩu" required value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #ccc' }} />
        <button type="submit" style={{ width: '100%', padding: '12px', background: '#40c057', color: 'white', fontWeight: 'bold', fontSize: '1rem', border: 'none', borderRadius: '8px' }}>TẠO TÀI KHOẢN</button>
      </form>
    </div>
  );
};

export default Register;