// src/routes/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth();

  // 1. Kiểm tra xem user đã đăng nhập chưa
  if (!user) {
    // Chưa đăng nhập thì điều hướng về trang Login
    return <Navigate to="/login" replace />;
  }

  // 2. Kiểm tra xem role của user có nằm trong danh sách được phép không
  if (!allowedRoles.includes(user.role)) {
    // Nếu là 'customer' mà cố vào '/admin', điều hướng về trang báo lỗi hoặc trang chủ
    return <Navigate to="/unauthorized" replace />;
  }

  // 3. Nếu hợp lệ, cho phép render các component con (các trang Dashboards)
  return <Outlet />;
};

export default ProtectedRoute;