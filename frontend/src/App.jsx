import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';

// Import Layout chính (Chứa Sidebar và Header)
import Layout from './components/Layout';
import Login from './pages/Login';
// Import tất cả các trang (Pages)
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Inventory from './pages/Inventory';
import Warranty from './pages/Warranty';
import SalesReports from './pages/SalesReports';
import Customers from './pages/Customers';
import Settings from './pages/Settings';


const ProtectedRoute = ({ isAuthenticated }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />; // Cho phép đi tiếp vào các trang con
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isLoggedIn') === 'true'
  );

  // 2. Hàm xử lý Login thành công
  const handleLoginSuccess = () => {
    localStorage.setItem('isLoggedIn', 'true'); // Lưu vào máy
    setIsAuthenticated(true); // Cập nhật state
  };

  // 3. Hàm xử lý Logout (Đã được Layout gọi)
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn'); // Xóa khỏi máy
    setIsAuthenticated(false); // Cập nhật state
  };
  return (
    <BrowserRouter>
      <Routes>
        {/* ROUTE CÔNG KHAI: Trang Login */}
        <Route 
          path="/login" 
          element={
            isAuthenticated ? 
              <Navigate to="/" replace /> : // Nếu login rồi mà vào /login -> Đá về Dashboard
              <Login onLoginSuccess={handleLoginSuccess} />
          } 
        />
        {/* ROUTE ĐƯỢC BẢO VỆ: Cần login mới vào được */}
        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
          {/* Layout chính nhận hàm handleLogout để truyền xuống Modal */}
          <Route path="/" element={<Layout onLogout={handleLogout} />}>
          <Route index element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders" element={<Orders />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="warranty" element={<Warranty />} />
          <Route path="sales" element={<SalesReports />} />
          <Route path="customers" element={<Customers />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>
          {/* Xử lý đường dẫn lỗi (404 Not Found) - Tự động đá về Dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;