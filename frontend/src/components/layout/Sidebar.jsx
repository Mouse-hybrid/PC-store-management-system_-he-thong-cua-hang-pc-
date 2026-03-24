// src/components/layout/Sidebar.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // Context phân quyền ở bước trước
import LogoutModal from '../common/LogoutModal';

const Sidebar = () => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Hàm xử lý khi bấm nút Logout trong Modal
  const handleConfirmLogout = () => {
    logout(); // Xóa thông tin user và token trong Context/LocalStorage
    setIsLogoutModalOpen(false); // Đóng modal
    navigate('/login'); // Đá về trang đăng nhập
  };

  return (
    <div className="w-64 h-screen bg-white border-r flex flex-col justify-between">
      {/* ... Các menu điều hướng ở trên (Dashboard, Orders, v.v.) ... */}
      
      {/* Khu vực hiển thị User ở dưới cùng */}
      <div className="p-4 border-t">
        <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-300 rounded-full mr-2"></div>
            <div>
              <p className="text-sm font-bold">{user?.name || "Alex Morgan"}</p>
              <p className="text-xs text-gray-500">{user?.role === 'admin' ? "Senior Admin" : "Staff"}</p>
            </div>
          </div>
          
          {/* Nút Trigger mở Modal Đăng xuất */}
          <button 
            onClick={() => setIsLogoutModalOpen(true)}
            className="text-red-500 hover:text-red-700"
          >
            {/* Icon nút ra ngoài */}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          </button>
        </div>
      </div>

      {/* Gọi Modal ở đây */}
      <LogoutModal 
        isOpen={isLogoutModalOpen} 
        onClose={() => setIsLogoutModalOpen(false)} 
        onConfirm={handleConfirmLogout} 
      />
    </div>
  );
};

export default Sidebar;