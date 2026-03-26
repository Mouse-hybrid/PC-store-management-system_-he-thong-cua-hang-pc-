// src/routes/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userRole = user.role?.toUpperCase() || '';
  const safeAllowedRoles = allowedRoles.map(role => role.toUpperCase());

  if (!safeAllowedRoles.includes(userRole)) {
    // ĐÃ SỬA: Tránh vòng lặp vô hạn bằng cách đưa user về đúng "nhà" của họ
    if (userRole === 'ADMIN') return <Navigate to="/admin" replace />;
    if (userRole === 'STAFF') return <Navigate to="/staff" replace />;
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;