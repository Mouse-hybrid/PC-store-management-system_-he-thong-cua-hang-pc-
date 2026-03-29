// src/routes/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  // 👉 SỬA TẠI ĐÂY: Lấy thêm biến loading từ AuthContext
  const { user, loading } = useAuth();

  // 👉 BƯỚC QUAN TRỌNG: Nếu đang load API thì hiện màn hình chờ, TUYỆT ĐỐI KHÔNG ĐÁ RA
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-pulse text-teal-600 font-bold text-lg">Đang xác minh phiên đăng nhập...</div>
      </div>
    );
  }

  // Sau khi loading xong, nếu thực sự không có user thì mới đuổi ra Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userRole = user.role?.toUpperCase() || '';
  const safeAllowedRoles = allowedRoles.map(role => role.toUpperCase());

  if (!safeAllowedRoles.includes(userRole)) {
    // Tránh vòng lặp vô hạn bằng cách đưa user về đúng "nhà" của họ
    if (userRole === 'ADMIN') return <Navigate to="/admin" replace />;
    if (userRole === 'STAFF') return <Navigate to="/staff" replace />;
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;