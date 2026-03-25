// src/routes/AppRouter.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import Component kiểm tra quyền
import ProtectedRoute from './ProtectedRoute';

// Import các Layouts
import StaffLayout from '../components/layout/StaffLayout';
import AdminLayout from '../components/layout/AdminLayout'; // Đã import Layout của Admin

// Import Pages
import LoginPage from '../pages/Auth/LoginPage';
import AdminDashboard from '../pages/Admin/AdminDashboard';
import ProductManagement from '../pages/Admin/ProductManagement'; 
import StaffPortal from '../pages/Staff/StaffPortal';
import Orders from '../pages/Staff/Orders';
import Settings from '../pages/Staff/Settings';
import AdminSettings from '../pages/Admin/AdminSettings';
import StaffManagement from '../pages/Admin/StaffManagement';
import UserManagement from '../pages/Admin/UserManagement';

// Tạo các component giả cho các trang chưa code để tránh lỗi UI
const Inventory = () => <div className="p-8"><h1 className="text-2xl font-bold">Inventory Page</h1></div>;
const Warranty = () => <div className="p-8"><h1 className="text-2xl font-bold">Warranty Page</h1></div>;
const SalesReports = () => <div className="p-8"><h1 className="text-2xl font-bold">Sales Reports Page</h1></div>;
const Customers = () => <div className="p-8"><h1 className="text-2xl font-bold">Customers Page</h1></div>;

const AppRouter = () => {
  return (
    <Routes>
      {/* 🔴 1. PUBLIC ROUTE */}
      <Route path="/login" element={<LoginPage />} />

      {/* 🔵 2. ADMIN ROUTES (ĐÃ SỬA LẠI ĐỂ LỒNG LAYOUT) */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        
        {/* Render AdminLayout làm khung bọc ngoài */}
        <Route path="/admin" element={<AdminLayout />}>
          
          {/* Mặc định vào /admin sẽ chuyển sang /admin/dashboard */}
          <Route index element={<Navigate to="dashboard" replace />} />
          
          {/* Các trang con sẽ chui vào thẻ <Outlet /> trong AdminLayout */}
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<ProductManagement />} />
          
          {/* Bạn có thể thêm các trang khác của Admin vào đây sau */}
          {/* <Route path="orders" element={<AdminOrders />} /> */}
          <Route path="users" element={<UserManagement />} />
          <Route path="staffs" element={<StaffManagement />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Route>

      {/* 🟢 3. STAFF ROUTES */}
      <Route element={<ProtectedRoute allowedRoles={['staff', 'admin']} />}>
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

      {/* 🟡 4. CUSTOMER ROUTE */}
      <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
         <Route path="/" element={<div className="p-10 text-xl font-bold text-center">Trang chủ E-commerce cho Khách hàng</div>} />
      </Route>

      {/* 🟣 5. FALLBACK ROUTE */}
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