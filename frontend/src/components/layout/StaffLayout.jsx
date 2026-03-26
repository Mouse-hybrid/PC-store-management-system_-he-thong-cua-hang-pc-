// src/components/layout/StaffLayout.jsx
import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import LogoutModal from '../common/LogoutModal';
import { useAuth } from '../../contexts/AuthContext';

const StaffLayout = () => {
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // --- THÊM STATE CHO THANH SEARCH TRÊN CÙNG ---
  const [topSearch, setTopSearch] = useState('');

  const handleTopSearch = (e) => {
    if (e.key === 'Enter' && topSearch.trim()) {
      // Điều hướng sang trang Orders kèm query param ?search=...
      navigate(`/staff/orders?search=${encodeURIComponent(topSearch.trim())}`);
      setTopSearch(''); // Xóa nội dung sau khi Enter
    }
  };

  const menuItems = [
    { name: 'Dashboard', path: '/staff/dashboard', icon: '📊' },
    { name: 'Orders', path: '/staff/orders', icon: '🛒' },
    { name: 'Inventory', path: '/staff/inventory', icon: '📦' },
    { name: 'Warranty', path: '/staff/warranty', icon: '🛡️' },
    { name: 'Sales Reports', path: '/staff/reports', icon: '📈' },
    { name: 'Customers', path: '/staff/customers', icon: '👥' },
    { name: 'Settings', path: '/staff/settings', icon: '⚙️' },
  ];

  const handleAdminReturn = (e) => {
    e.preventDefault();
    if (user?.role?.toUpperCase() === 'ADMIN') {
      navigate('/admin/dashboard');
    } else {
      alert('🚫 Truy cập bị từ chối!');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">P</div>
          <span className="font-bold text-lg text-gray-900">PC STORE</span>
        </div>
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <p className="text-xs font-bold text-gray-400 mb-4 px-2">MAIN MENU</p>
          {menuItems.map((item) => (
            <NavLink key={item.name} to={item.path} className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
              <span>{item.icon}</span> {item.name}
            </NavLink>
          ))}
          <div className="pt-4 mt-4 border-t border-gray-100">
            <button onClick={handleAdminReturn} className="flex w-full items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors text-purple-600 hover:bg-purple-50">
              <span>👑</span> Quản trị Admin
            </button>
          </div>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold truncate">{user?.name || "Staff"}</p>
                <p className="text-xs text-gray-500 truncate">Senior Staff</p>
              </div>
            </div>
            <button onClick={() => setIsLogoutOpen(true)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-colors">🚪</button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white h-16 border-b border-gray-200 flex items-center justify-between px-8 shrink-0">
          <div className="w-1/2 max-w-md relative">
            {/* --- CẬP NHẬT Ô INPUT NÀY --- */}
            <input 
              type="text" 
              placeholder="Tìm mã đơn, tên khách..." 
              value={topSearch}
              onChange={(e) => setTopSearch(e.target.value)}
              onKeyDown={handleTopSearch}
              className="w-full bg-gray-50 border-none rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-100 outline-none" 
            />
            <span className="absolute left-3 top-2 text-gray-400">🔍</span>
          </div>
          <div className="flex items-center gap-4">
             <p className="text-sm font-bold">{user?.name || "Staff"}</p>
             <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <Outlet /> 
        </div>
      </main>
      <LogoutModal isOpen={isLogoutOpen} onClose={() => setIsLogoutOpen(false)} onConfirm={logout} />
    </div>
  );
};

export default StaffLayout;