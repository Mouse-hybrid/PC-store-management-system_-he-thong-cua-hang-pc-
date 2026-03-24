import React, { useState } from 'react';
import { Mail, Lock, AlertCircle } from 'lucide-react';

// Giả lập tài khoản admin (Trong thực tế API sẽ check database)
const MOCK_CREDENTIALS = {
  email: 'admin@pcstore.com',
  password: 'password123'
};

export default function Login({ onLoginSuccess }) {
  // --- STATE MANAGEMENT ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); // Lưu thông báo lỗi

  // --- LOGIC XỬ LÝ ĐĂNG NHẬP (Giả lập) ---
  const handleSignIn = (e) => {
    e.preventDefault(); // Ngăn load lại trang
    setError(null);

    // Kiểm tra đơn giản
    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ Email và Mật khẩu.');
      return;
    }

    if (email === MOCK_CREDENTIALS.email && password === MOCK_CREDENTIALS.password) {
      // Đăng nhập THÀNH CÔNG
      onLoginSuccess();
    } else {
      // Đăng nhập THẤT BẠI
      setError('Email hoặc Mật khẩu không chính xác. Vui lòng thử lại.');
      setPassword(''); // Xóa mật khẩu cũ
    }
  };

  return (
    // Background Full-screen với ảnh kho hàng PC (Dùng ảnh tạm từ Unsplash)
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-cover bg-center bg-no-repeat relative" 
         style={{ backgroundImage: `url('https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=1920')` }}>
      
      {/* Lớp overlay đen mờ (Ảnh 1) */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Card Đăng nhập ở giữa */}
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-10 w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-6">
        
        {/* Logo PC STORE */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-3 shadow-md">
            P
          </div>
          <h1 className="font-bold text-gray-900 text-base tracking-widest">PC STORE</h1>
          <p className="text-xs text-gray-500 mt-1">Staff Portal</p>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">Sign in to your account</h2>
        <p className="text-sm text-gray-500 text-center mb-8">Welcome back! Please enter your details.</p>

        {/* Thông báo lỗi (Ảnh 1: Chỗ Chữ đỏ) */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl flex items-center gap-3 text-sm mb-6 animate-in shake duration-300">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Form Đăng nhập */}
        <form onSubmit={handleSignIn} className="space-y-6">
          {/* Input Email */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
              />
            </div>
          </div>

          {/* Input Password */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Password</label>
              <a href="#" className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">Forgot Password?</a>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
              />
            </div>
          </div>

          {/* Remember me (Ảnh 1) */}
          <div className="flex items-center">
            <input type="checkbox" id="remember" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" />
            <label htmlFor="remember" className="ml-2 text-sm text-gray-600">Remember for 30 days</label>
          </div>

          {/* Nút Sign In (Ảnh 1) */}
          <button 
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3.5 rounded-xl hover:bg-blue-700 transition-colors shadow-sm focus:ring-4 focus:ring-blue-100"
          >
            Sign In
          </button>
        </form>

        {/* Contact Admin (Ảnh 1) */}
        <div className="text-center mt-10">
          <p className="text-sm text-gray-500">
            Don't have an account? <a href="#" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">Contact Admin</a>
          </p>
          </div>
        </div>

      </div>
  );
}