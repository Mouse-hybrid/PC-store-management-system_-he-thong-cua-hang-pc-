// src/pages/Auth/LoginPage.jsx
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

export default function LoginPage() {
  // --- STATE MANAGEMENT ---
  const [usernameOrEmail, setUsernameOrEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // --- LOGIC XỬ LÝ ĐĂNG NHẬP API ---
  const handleSignIn = async (e) => {
    e.preventDefault(); 
    setError(null);

    if (!usernameOrEmail || !password) {
      setError('Vui lòng nhập đầy đủ Email/Username và Mật khẩu.');
      return;
    }

    try {
      setIsLoading(true);
      
      // Gọi API Đăng nhập
      const res = await axiosClient.post('/auth/login', {
        username: usernameOrEmail.trim(), 
        password: password.trim()
      });

      // Bóc tách Token và Dữ liệu user từ response
      // (Vì axiosClient interceptor đã bọc data, nên ta lấy res.data hoặc res trực tiếp)
      const token = res.data?.accessToken || res.accessToken;
      const userRole = res.data?.user?.role || res.user?.role || 'STAFF';

      if (token) {
        // 1. LƯU TOKEN VÀO BỘ NHỚ TRÌNH DUYỆT
        localStorage.setItem('access_token', token);

        // 2. ĐIỀU HƯỚNG VÀO ĐÚNG DASHBOARD THEO QUYỀN
        if (userRole.toUpperCase() === 'ADMIN') {
          window.location.href = '/admin/dashboard';
        } else {
          window.location.href = '/staff/dashboard';
        }
      } else {
        setError('Lỗi hệ thống: Không nhận được Token phân quyền!');
      }
      
    } catch (err) {
      // Hiển thị đúng lỗi từ Backend (Ví dụ: "Tài khoản không tồn tại" hoặc "Sai mật khẩu")
      setError(err.response?.data?.message || 'Tên đăng nhập hoặc mật khẩu không chính xác');
      setPassword(''); 
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-gray-50 font-sans">
      <div className="w-full max-w-md flex flex-col items-center">
        
        {/* --- LOGO & HEADER --- */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-teal-600 rounded-xl flex items-center justify-center mb-3 shadow-sm">
            <div className="w-7 h-7 bg-gray-50 rounded-sm"></div>
          </div>
          <h1 className="font-bold text-gray-900 text-xl tracking-wide">PC STORE</h1>
          <p className="text-[11px] text-gray-500 uppercase tracking-widest mt-1">ADMIN & STAFF PORTAL</p>
        </div>

        {/* --- FORM CARD --- */}
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-10 w-full animate-in fade-in slide-in-from-bottom-4">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Welcome Back</h2>
          <p className="text-sm text-gray-500 text-center mb-8">Please sign in to continue.</p>

          {/* Hiển thị lỗi */}
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-500 p-3.5 rounded-lg text-center text-sm font-medium mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSignIn} className="space-y-5">
            {/* Input Email / Username */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Email / Username</label>
              <input 
                type="text" 
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                placeholder="admin@pcstore.com"
                className="w-full bg-[#f4f7fb] border border-transparent rounded-lg px-4 py-3 text-sm font-medium text-gray-800 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none transition-all"
              />
            </div>

            {/* Input Password */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-gray-900">Password</label>
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs font-bold text-teal-600 hover:text-teal-700 transition-colors"
                >
                  {showPassword ? 'hide password' : 'show password'}
                </button>
              </div>
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#f4f7fb] border border-transparent rounded-lg px-4 py-3 text-sm font-medium text-gray-800 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none transition-all tracking-wider placeholder:tracking-normal"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center text-sm text-gray-600 cursor-pointer group">
                <input type="checkbox" className="mr-2 w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500 cursor-pointer" />
                <span className="group-hover:text-gray-800 transition-colors">Remember Me</span>
              </label>
              <button type="button" className="text-sm font-bold text-teal-600 hover:text-teal-700 transition-colors">
                Forgot Password?
              </button>
            </div>

            <div className="pt-4">
              <button 
                type="submit"
                disabled={isLoading}
                className={`w-full bg-teal-600 text-white font-bold py-3.5 rounded-lg hover:bg-teal-700 transition-all shadow-sm flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                {isLoading ? 'Signing in...' : 'Login'}
              </button>
            </div>
          </form>

          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              Don't have an account? <button type="button" className="font-bold text-gray-800 hover:text-teal-600 transition-colors ml-1">Contact Admin.</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}