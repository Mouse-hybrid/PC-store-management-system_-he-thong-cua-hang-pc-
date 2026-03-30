// src/routes/AppRouter.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import Component kiểm tra quyền
import ProtectedRoute from './ProtectedRoute';

// Import các Layouts
import StaffLayout from '../components/layout/StaffLayout';
import AdminLayout from '../components/layout/AdminLayout';

// Import Pages Admin
import LoginPage from '../pages/Auth/LoginPage';
import AdminDashboard from '../pages/Admin/AdminDashboard';
import ProductManagement from '../pages/Admin/ProductManagement'; 
import OrderManagement from '../pages/Admin/OrderManagement'; 
import CategoryManagement from '../pages/Admin/CategoryManagement'; 
import PromotionManagement from '../pages/Admin/PromotionManagement'; 
import AdminSettings from '../pages/Admin/AdminSettings';
import StaffManagement from '../pages/Admin/StaffManagement';
import UserManagement from '../pages/Admin/UserManagement';
import SalesReports from '../pages/Admin/SalesReports'; 

// Import Pages Staff
import StaffPortal from '../pages/Staff/StaffPortal';
import Orders from '../pages/Staff/Orders';
import Settings from '../pages/Staff/Settings';
import Inventory from '../pages/Staff/Inventory';
import Warranty from '../pages/Staff/Warranty';
import Customers from '../pages/Staff/Customers';

const AppRouter = () => {
  return (
    <Routes>
      {/* 👉 CÚ CHỐT: Tự động chuyển hướng trang chủ (/) sang trang Đăng nhập (/login) */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* 🔴 1. PUBLIC ROUTE */}
      <Route path="/login" element={<LoginPage />} />

      {/* 🔵 2. ADMIN ROUTES */}
      <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="orders" element={<OrderManagement />} />
          <Route path="categories" element={<CategoryManagement />} />
          <Route path="promotions" element={<PromotionManagement />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="staffs" element={<StaffManagement />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="reports" element={<SalesReports />} />
        </Route>
      </Route>

      {/* 🟢 3. STAFF ROUTES */}
      <Route element={<ProtectedRoute allowedRoles={['STAFF', 'ADMIN']} />}>
        <Route path="/staff" element={<StaffLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<StaffPortal />} />
          <Route path="orders" element={<Orders />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="warranty" element={<Warranty />} />
          <Route path="reports" element={<SalesReports />} />
          <Route path="customers" element={<Customers />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>

      {/* 🟣 4. FALLBACK ROUTE (404) */}
      <Route path="*" element={
        <div className="h-screen flex items-center justify-center flex-col gap-4">
          <h1 className="text-4xl font-bold text-gray-800">404 - Không tìm thấy trang</h1>
          <button onClick={() => window.history.back()} className="text-blue-600 underline">Quay lại</button>
        </div>
      } />
    </Routes>
  );
};

export default AppRouter;