// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import axiosClient from '../api/axiosClient'; // Nhớ import axiosClient để gọi API

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  // 👉 1. THÊM BIẾN LOADING (Mặc định là true để chặn ProtectedRoute không đá ra ngay)
  const [loading, setLoading] = useState(true);

  // 👉 2. TỰ ĐỘNG XÁC THỰC TOKEN MỖI KHI TẢI LẠI TRANG
  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem('access_token');
      
      // Nếu không có Token, chắc chắn chưa đăng nhập
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Có Token -> Gọi API hỏi Backend xem User này là ai
        const res = await axiosClient.get('/users/me');
        
        // Lấy data từ response (Tùy cấu trúc axiosClient của bạn)
        const userData = res.data?.data || res.data || res;
        
        setUser(userData); // Lưu thông tin thật vào state
      } catch (error) {
        console.error("Lỗi xác thực Token:", error);
        // Token hết hạn hoặc sai -> Xóa token cũ đi
        localStorage.removeItem('access_token');
        setUser(null);
      } finally {
        // Dù thành công hay thất bại cũng phải tắt màn hình Loading
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  // 3. Hàm đăng xuất: Xóa State và dọn dẹp Token
  const logout = async () => {
    try {
      // (Tùy chọn) Gọi API logout để xóa Refresh Token dưới Database
      await axiosClient.post('/auth/logout');
    } catch (error) {
      console.log("Lỗi logout API", error);
    } finally {
      setUser(null);
      localStorage.removeItem('access_token');
      window.location.href = '/login'; // Đá thẳng về trang đăng nhập
    }
  };

  return (
    // 👉 Đã bỏ chữ `login` vì ở LoginPage bạn xử lý trực tiếp rồi, tránh lỗi undefined
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);