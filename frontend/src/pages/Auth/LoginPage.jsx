// src/pages/Auth/LoginPage.jsx
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // Context phân quyền ở bước trước

const LoginPage = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth(); // Lấy hàm setUser để cập nhật trạng thái khi login thành công

  // Định nghĩa Schema validate bằng Yup
  const validationSchema = Yup.object({
    username: Yup.string()
      .required('Username or email is required'), // Báo lỗi nếu để trống
    password: Yup.string()
      .required('Password is required'), // Báo lỗi nếu để trống
  });

  // Khởi tạo Formik
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      rememberMe: false,
    },
    validationSchema: validationSchema, // Gắn schema validate
    onSubmit: async (values) => {
      // 1. Giả lập gọi API (thực tế bạn sẽ dùng axios gọi backend Node.js)
      console.log('Form data:', values);

      // 2. Giả lập response thành công tùy theo dữ liệu nhập (để test phân quyền)
      let fakeUser;
      if (values.username === 'admin@pcstore.com') {
        fakeUser = { name: 'Admin User', role: 'admin' };
      } else if (values.username === 'staff@pcstore.com') {
        fakeUser = { name: 'Alex Johnson', role: 'staff' };
      } else {
        fakeUser = { name: 'Customer User', role: 'customer' };
      }

      // 3. Cập nhật User vào Context
      setUser(fakeUser);
      // Lưu token vào localStorage ở đây nếu cần

      // 4. Điều hướng dựa trên role (Logic đã thiết lập ở Route)
      if (fakeUser.role === 'admin') navigate('/admin');
      else if (fakeUser.role === 'staff') navigate('/staff');
      else navigate('/'); // Về trang chủ customer
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center font-sans">
      <div className="w-full max-w-lg">
        {/* Logo và Header */}
        <div className="flex flex-col items-center mb-10">
          <div className="text-teal-600 mb-2">
            {/* Icon Chip PC STORE */}
            <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M19 19h2a2 2 0 002-2V7a2 2 0 00-2-2h-2V3a2 2 0 00-2-2H7a2 2 0 00-2 2v2H3a2 2 0 00-2 2v10a2 2 0 002 2h2v2a2 2 0 002 2h10a2 2 0 002-2v-2zm-12 0H5V7h14v10h-2v1H7v-1zm10-14V3H7v2h10z"/></svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">PC STORE</h1>
          <p className="text-gray-500 text-sm">ADMIN & STAFF PORTAL</p>
        </div>

        {/* Khung Login Form */}
        <form onSubmit={formik.handleSubmit} className="bg-white p-10 rounded-2xl shadow-lg">
          <h2 className="text-3xl font-bold text-gray-950 mb-3 text-center">Welcome Back</h2>
          <p className="text-gray-500 mb-8 text-center text-sm font-medium">Please sign in to continue.</p>

          {/* Username Field */}
          <div className="mb-5">
            <label className="block text-gray-900 font-bold mb-2">Email or Username</label>
            <input
              type="text"
              name="username"
              placeholder="someone@example.com"
              className={`w-full p-3 border ${formik.touched.username && formik.errors.username ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-teal-200 focus:border-teal-400`}
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur} // Đánh dấu input đã được tương tác
            />
            {/* Hiển thị lỗi nếu có */}
            {formik.touched.username && formik.errors.username ? (
              <div className="text-red-500 text-xs mt-1 font-medium">{formik.errors.username}</div>
            ) : null}
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="text-gray-900 font-bold">Password</label>
              <button type="button" className="text-sm text-teal-600 hover:text-teal-700 font-medium">show password</button>
            </div>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              className={`w-full p-3 border ${formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-teal-200 focus:border-teal-400`}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {/* Hiển thị lỗi nếu có */}
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

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-teal-600 text-white p-3.5 rounded-lg font-bold hover:bg-teal-700 transition-colors mb-4"
          >
            Login
          </button>

          <p className="text-center text-sm text-gray-600 font-medium">Don't have an account? Contact Admin.</p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;