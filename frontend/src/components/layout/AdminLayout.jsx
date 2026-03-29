// src/components/layout/AdminLayout.jsx
import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import LogoutModal from '../common/LogoutModal';
import { useAuth } from '../../contexts/AuthContext';

const AdminLayout = () => {
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [topSearch, setTopSearch] = useState('');

  const adminMenuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
    { name: 'Order Management', path: '/admin/orders', icon: '🛒' },
    { name: 'Product Management', path: '/admin/products', icon: '📦' },
    { name: 'Category Management', path: '/admin/categories', icon: '🗂️' },
    { name: 'Promotion Management', path: '/admin/promotions', icon: '🏷️' },
    { name: 'User Management', path: '/admin/users', icon: '👥' },
    { name: 'Staff Management', path: '/admin/staffs', icon: '👨‍💼' },
    { name: 'Sales Reports', path: '/admin/reports', icon: '📈' },
    { name: 'Staff portal', path: '/staff', icon: '🚪' },
    { name: 'Settings', path: '/admin/settings', icon: '⚙️' },
  ];

  // --- ĐÃ CẬP NHẬT LOGIC TÌM KIẾM THEO YÊU CẦU ---
  const handleTopSearch = (e) => {
    if (e.key === 'Enter' && topSearch.trim()) {
      const query = topSearch.trim().toLowerCase();
      
      // Quét qua danh sách menu để xem có menu nào chứa từ khóa không
      const foundMenu = adminMenuItems.find(item => 
        item.name.toLowerCase().includes(query) || 
        item.path.toLowerCase().includes(query)
      );

      if (foundMenu) {
        navigate(foundMenu.path);
      } else {
        alert('Chức năng không có hoặc đang chuẩn bị ra mắt!');
      }
      setTopSearch(''); 
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">P</div>
          <span className="font-bold text-lg text-gray-900">PC STORE ADMIN</span>
        </div>
        
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

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold truncate">{user?.name || "Admin"}</p>
                <p className="text-xs text-gray-500 truncate">{user?.role === 'ADMIN' ? "System Admin" : "Staff"}</p>
              </div>
            </div>
            <button onClick={() => setIsLogoutOpen(true)} className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-md transition-colors" title="Logout">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white h-16 border-b border-gray-200 flex items-center justify-between px-8 shrink-0 shadow-sm z-10">
          <div className="w-1/2 max-w-md relative">
            <input 
              type="text" 
              placeholder="Nhập tên chức năng (VD: order, user...)" 
              value={topSearch}
              onChange={(e) => setTopSearch(e.target.value)}
              onKeyDown={handleTopSearch}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all" 
            />
            <span className="absolute left-3 top-2 text-gray-400">🔍</span>
          </div>
          <div className="flex items-center gap-5">
            <button className="text-gray-400 hover:text-blue-600 transition-colors relative">
              🔔<span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 border-l border-gray-200 pl-5">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-gray-900">{user?.name || "Admin"}</p>
                <p className="text-xs text-gray-500">System Admin</p>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-gray-50">
          <Outlet /> 
        </div>
      </main>

      <LogoutModal isOpen={isLogoutOpen} onClose={() => setIsLogoutOpen(false)} onConfirm={logout} />
    </div>
  );
};

export default AdminLayout;