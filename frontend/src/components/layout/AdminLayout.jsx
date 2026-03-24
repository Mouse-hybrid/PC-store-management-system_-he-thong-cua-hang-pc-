// src/components/layout/AdminLayout.jsx
import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import LogoutModal from '../common/LogoutModal';
import { useAuth } from '../../contexts/AuthContext';

const AdminLayout = () => {
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const { user, logout } = useAuth();

  // ĐẶT ĐOẠN CODE CỦA BẠN VÀO ĐÂY (Bên trong component AdminLayout)
  const adminMenuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
    { name: 'Order Management', path: '/admin/orders', icon: '🛒' },
    { name: 'Product Management', path: '/admin/products', icon: '📦' },
    { name: 'Category Management', path: '/admin/categories', icon: '🗂️' },
    { name: 'Promotion Management', path: '/admin/promotions', icon: '🏷️' },
    { name: 'User Management', path: '/admin/users', icon: '👥' },
    { name: 'Staff Management', path: '/admin/staff', icon: '👨‍💼' },
    { name: 'Sales Reports', path: '/admin/reports', icon: '📈' },
    { name: 'Staff portal', path: '/staff', icon: '🚪' },
    { name: 'Settings', path: '/admin/settings', icon: '⚙️' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* --- Sidebar của Admin --- */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full"></div>
          <span className="font-bold text-lg text-gray-900">PC STORE ADMIN</span>
        </div>
        
        {/* Render danh sách Menu */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <p className="text-xs font-bold text-gray-400 mb-4 px-2">MAIN MENU</p>
          
          {adminMenuItems.map((item) => (
            <NavLink 
              key={item.name} 
              to={item.path}
              className={({ isActive }) => 
                `flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${
                  isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                }`
              }
            >
              <span>{item.icon}</span> {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Thông tin Admin ở dưới cùng Sidebar */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
             {/* ... (Giống hệt StaffLayout) ... */}
          </div>
        </div>
        {/* Thông tin Admin ở dưới cùng Sidebar VÀ NÚT LOGOUT */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
            
            {/* Cụm Avatar và Tên */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                A
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold truncate">{user?.name || "Alex Admin"}</p>
                <p className="text-xs text-gray-500 truncate">{user?.role === 'admin' ? "Senior Admin" : "Staff"}</p>
              </div>
            </div>
            
            {/* Nút Đăng xuất (Màu đỏ) */}
            <button 
              onClick={() => setIsLogoutOpen(true)} 
              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-md transition-colors"
              title="Logout"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
            
          </div>
        </div>
      </aside>

      {/* --- Phần nội dung chính (Main Content) --- */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header trên cùng (Chứa thanh Search) */}
        <header className="bg-white h-16 border-b border-gray-200 flex items-center justify-between px-8 shrink-0">
           {/* ... (Giống hệt StaffLayout) ... */}
        </header>

        {/* Outlet sẽ render các trang con (Dashboard, Products, Users...) vào đây */}
        <div className="flex-1 overflow-y-auto p-8">
          <Outlet /> 
        </div>
      </main>

      <LogoutModal isOpen={isLogoutOpen} onClose={() => setIsLogoutOpen(false)} onConfirm={logout} />
    </div>
  );
};

export default AdminLayout;