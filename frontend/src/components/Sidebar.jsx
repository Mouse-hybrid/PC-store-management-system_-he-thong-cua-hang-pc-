import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Package, ShieldCheck, BarChart2, Users, Settings, LogOut } from 'lucide-react';

export default function Sidebar({ onLogoutClick }) {
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Orders', icon: ShoppingCart, path: '/orders' },
    { name: 'Inventory', icon: Package, path: '/inventory' },
    { name: 'Warranty', icon: ShieldCheck, path: '/warranty' },
    { name: 'Sales Reports', icon: BarChart2, path: '/sales' },
    { name: 'Customers', icon: Users, path: '/customers' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between h-full">
      <div>
        {/* Logo Section */}
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            P
          </div>
          <div>
            <h1 className="font-bold text-gray-800 text-sm tracking-wide">PC STORE</h1>
            <p className="text-xs text-gray-400">Staff Portal</p>
          </div>
        </div>

        {/* Menu Navigation */}
        <nav className="px-4 space-y-1 mt-2">
          <p className="text-xs font-semibold text-gray-400 mb-3 px-2">MAIN MENU</p>
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom Profile & Logout (Ảnh 2) */}
      <div className="p-4 border-t border-gray-100 mt-auto">
        {/* Click vào khu vực profile để mở Modal */}
        <div 
          onClick={onLogoutClick} // <-- Dòng quan trọng: Gắn sự kiện click
          className="flex items-center justify-between p-2 hover:bg-red-50 rounded-xl cursor-pointer transition-colors group"
          title="Click to Logout"
        >
          <div className="flex items-center gap-3">
            <img 
              src="https://ui-avatars.com/api/?name=Alex+Morgan&background=e5e7eb&color=374151" 
              alt="Avatar" 
              className="w-9 h-9 rounded-full border border-gray-100 shadow-sm"
            />
            <div>
              <p className="text-sm font-semibold text-gray-800">Alex Morgan</p>
              <p className="text-xs text-gray-500">Senior Admin</p>
            </div>
          </div>
          <LogOut className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
        </div>
      </div>
    </aside>
  );
}