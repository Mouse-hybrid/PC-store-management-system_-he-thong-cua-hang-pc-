// src/pages/Auth/LoginPage.jsx
import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axiosClient from '../../api/axiosClient';

const LoginPage = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [serverError, setServerError] = useState('');
  
  // 1. THÊM STATE ĐỂ QUẢN LÝ ẨN/HIỆN MẬT KHẨU
  const [showPassword, setShowPassword] = useState(false);

  const validationSchema = Yup.object({
    username: Yup.string().required('Username or email is required'),
    password: Yup.string().required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      rememberMe: false,
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setServerError('');
      
      try {
        const response = await axiosClient.post('/auth/login', {
          username: values.username, 
          password: values.password
        });

        // 1. IN RA ĐỂ KIỂM TRA TẬN MẮT (Mở F12 -> Console để xem)
        console.log("📦 DỮ LIỆU BACKEND GỬI VỀ:", response);

        // 2. LƯỚI QUÉT TOKEN Ở MỌI TẦNG DỮ LIỆU
        // Dù Backend có bọc bao nhiêu lớp data đi nữa, mã này sẽ tìm ra
        const token = response?.accessToken 
                   || response?.data?.accessToken 
                   || response?.data?.data?.accessToken;

        const loggedInUser = response?.user 
                          || response?.data?.user 
                          || response?.data?.data?.user;

        if (!token) {
          throw new Error("Vẫn chưa tìm thấy Token! Hãy mở F12, chụp dòng '📦 DỮ LIỆU BACKEND GỬI VỀ' gửi cho mình xem nhé.");
        }

        // 3. LƯU VÀO LOCAL STORAGE
        localStorage.setItem('access_token', token);
        localStorage.setItem('user_info', JSON.stringify(loggedInUser));

        // 4. CẬP NHẬT CONTEXT & CHUYỂN HƯỚNG
        setUser(loggedInUser);

        const userRole = loggedInUser?.role?.toUpperCase() || 'MEMBER';
        if (userRole === 'ADMIN') {
          navigate('/admin');
        } else if (userRole === 'STAFF') {
          navigate('/staff');
        } else {
          navigate('/'); 
        }

      } catch (error) {
        console.error('Login Failed:', error);
        
        // Cải thiện logic bắt lỗi để lấy đúng thông báo từ Zod hoặc Server
        let errorMsg = 'Đăng nhập thất bại. Không thể kết nối tới Server.';
        if (error.response?.data?.message) {
           errorMsg = error.response.data.message;
        } else if (error.message) {
           errorMsg = error.message;
        }
        
        setServerError(errorMsg);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center font-sans">
      <div className="w-full max-w-lg">
        {/* Logo và Header */}
        <div className="flex flex-col items-center mb-10">
          <div className="text-teal-600 mb-2">
            <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M19 19h2a2 2 0 002-2V7a2 2 0 00-2-2h-2V3a2 2 0 00-2-2H7a2 2 0 00-2 2v2H3a2 2 0 00-2 2v10a2 2 0 002 2h2v2a2 2 0 002 2h10a2 2 0 002-2v-2zm-12 0H5V7h14v10h-2v1H7v-1zm10-14V3H7v2h10z"/></svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">PC STORE</h1>
          <p className="text-gray-500 text-sm">ADMIN & STAFF PORTAL</p>
        </div>

        {/* Khung Login Form */}
        <form onSubmit={formik.handleSubmit} className="bg-white p-10 rounded-2xl shadow-lg">
          <h2 className="text-3xl font-bold text-gray-950 mb-3 text-center">Welcome Back</h2>
          <p className="text-gray-500 mb-8 text-center text-sm font-medium">Please sign in to continue.</p>

          {serverError && (
            <div className="mb-6 p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-medium text-center">
              {serverError}
            </div>
          )}

          {/* Username Field */}
          <div className="mb-5">
            <label className="block text-gray-900 font-bold mb-2">Email Address</label>
            <input
              type="text"
              name="username"
              placeholder="admin@pcstore.com"
              className={`w-full p-3 border ${formik.touched.username && formik.errors.username ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-teal-200 focus:border-teal-400`}
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.username && formik.errors.username ? (
              <div className="text-red-500 text-xs mt-1 font-medium">{formik.errors.username}</div>
            ) : null}
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="text-gray-900 font-bold">Password</label>
              {/* 3. NÚT TOGGLE ẨN/HIỆN MẬT KHẨU */}
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="text-sm text-teal-600 hover:text-teal-700 font-medium"
              >
                {showPassword ? 'hide password' : 'show password'}
              </button>
            </div>
            {/* 4. CHUYỂN TYPE CỦA INPUT DỰA VÀO STATE */}
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="••••••••"
              className={`w-full p-3 border ${formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-teal-200 focus:border-teal-400`}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.password && formik.errors.password ? (
              <div className="text-red-500 text-xs mt-1 font-medium">{formik.errors.password}</div>
            ) : null}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <input type="checkbox" name="rememberMe" className="mr-2 rounded text-teal-600 focus:ring-teal-500" />
              <label className="text-sm text-gray-700 font-medium">Remember Me</label>
            </div>
            <a href="#" className="text-sm text-teal-600 hover:text-teal-700 font-medium">Forgot Password?</a>
          </div>

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className={`w-full bg-teal-600 text-white p-3.5 rounded-lg font-bold hover:bg-teal-700 transition-colors mb-4 ${formik.isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {formik.isSubmitting ? 'Logging in...' : 'Login'}
          </button>

          <p className="text-center text-sm text-gray-600 font-medium">Don't have an account? Contact Admin.</p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;