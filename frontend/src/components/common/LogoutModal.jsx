// src/components/common/LogoutModal.jsx
import React from 'react';

const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
  // Nếu isOpen là false, không render gì cả
  if (!isOpen) return null;

  return (
    // Lớp Overlay màu xám, bao phủ toàn màn hình (fixed inset-0)
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600 bg-opacity-50">
      
      {/* Khung Modal màu trắng */}
      <div className="bg-white rounded-xl shadow-lg w-[400px] p-6 relative">
        
        {/* Header của Modal gồm Icon và Tiêu đề */}
        <div className="flex items-start mb-4">
          <div className="bg-red-100 text-red-600 rounded-full p-2 mr-4 flex-shrink-0">
            {/* Icon Logout (SVG) */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Confirm Logout</h3>
            <p className="text-sm text-gray-500 font-medium">End your current session</p>
          </div>
        </div>
        
        {/* Nội dung cảnh báo */}
        <p className="text-gray-600 text-sm mb-6 ml-14">
          Are you sure you want to log out of the admin dashboard? Any unsaved changes may be lost.
        </p>

        {/* Nút bấm (Buttons) */}
        <div className="flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;