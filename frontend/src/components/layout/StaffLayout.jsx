// src/components/layout/StaffLayout.jsx
import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import LogoutModal from '../common/LogoutModal';
import { useAuth } from '../../contexts/AuthContext';

const StaffLayout = () => {
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const { user, logout } = useAuth();

  // Menu Items cho Staff
  const menuItems = [
    { name: 'Dashboard', path: '/staff/dashboard', icon: '📊' },
    { name: 'Orders', path: '/staff/orders', icon: '🛒' },
    { name: 'Inventory', path: '/staff/inventory', icon: '📦' },
    { name: 'Warranty', path: '/staff/warranty', icon: '🛡️' },
    { name: 'Sales Reports', path: '/staff/reports', icon: '📈' },
    { name: 'Customers', path: '/staff/customers', icon: '👥' },
    { name: 'Settings', path: '/staff/settings', icon: '⚙️' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* --- Sidebar --- */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full"></div>
          <span className="font-bold text-lg text-gray-900">PC STORE</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <p className="text-xs font-bold text-gray-400 mb-4 px-2">MAIN MENU</p>
          {menuItems.map((item) => (
            <NavLink 
              key={item.name} to={item.path}
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

        {/* User Info & Logout */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
            <div className="flex items-center gap-2">
              <img src="/avatar.jpg" alt="Avatar" className="w-8 h-8 rounded-full" />
              <div>
                <p className="text-sm font-bold">{user?.name || "Alex Morgan"}</p>
                <p className="text-xs text-gray-500">Staff</p>
              </div>
            </div>
            <button onClick={() => setIsLogoutOpen(true)} className="text-red-500">🚪</button>
          </div>
        </div>
      </aside>

      {/* --- Main Content Area --- */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="bg-white h-16 border-b border-gray-200 flex items-center justify-between px-8 shrink-0">
          <div className="w-1/2 max-w-md relative">
            <input type="text" placeholder="Search orders, items..." className="w-full bg-gray-50 border-none rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-100 outline-none" />
            <span className="absolute left-3 top-2 text-gray-400">🔍</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-gray-500">🔔</button>
            <div className="flex items-center gap-2">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold">Alex Johnson</p>
                <p className="text-xs text-gray-500">Floor Manager</p>
              </div>
              <img src="/avatar2.jpg" className="w-8 h-8 rounded-full" alt="Profile" />
            </div>
          </div>
        </header>

        {/* Page Content (Thay đổi tùy theo Route) */}
        <div className="flex-1 overflow-y-auto p-8">
          <Outlet /> 
        </div>
      </main>

      <LogoutModal isOpen={isLogoutOpen} onClose={() => setIsLogoutOpen(false)} onConfirm={logout} />
    </div>
  );
};

export default StaffLayout;