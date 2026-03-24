// components/Layout.jsx
import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import LogoutModal from './LogoutModal';

export default function Layout() {
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#f8f9fa] font-sans text-gray-900 overflow-hidden">
      {/* Sidebar bên trái */}
      <Sidebar onLogoutClick={() => setIsLogoutOpen(true)} />
      
      {/* Cột nội dung bên phải */}
      <div className="flex flex-col flex-1 w-full">
        {/* Header ở trên cùng */}
        <Header />
        
        {/* Vùng render các trang (Dashboard, Orders, v.v.) */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet /> 
          </div>
        </main>
      </div>
        {/* Modal xác nhận đăng xuất (Tất cả logic nằm ở đây) */}
      <LogoutModal 
        isOpen={isLogoutOpen} // Truyền state đóng/mở
        onClose={() => setIsLogoutOpen(false)} // Bấm X hoặc Cancel -> Đóng
        onConfirm={() => {
          setIsLogoutOpen(false); // Đóng modal
          onLogout(); // Gọi hàm xóa localStorage thật
        }} 
      />
    </div>
  );
}