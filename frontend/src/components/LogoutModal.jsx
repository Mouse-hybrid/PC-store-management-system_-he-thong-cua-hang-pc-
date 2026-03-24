import React from 'react';
import { X, HelpCircle, LogOut } from 'lucide-react';

export default function LogoutModal({ isOpen, onClose, onConfirm }) {
  // Nếu modal không được mở -> Không render gì cả
  if (!isOpen) return null;

  return (
    // Backdrop đen mờ (Overlay - Ảnh 2)
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6 backdrop-blur-sm animate-in fade-in duration-300">
      
      {/* Card Modal ở giữa */}
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md relative animate-in zoom-in-95 duration-300">
        
        {/* Nút X đóng nhanh ở góc */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-1 rounded-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Nội dung Modal (Ảnh 2) */}
        <div className="text-center flex flex-col items-center">
          
          {/* Icon dấu chấm hỏi to màu xanh */}
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <HelpCircle className="w-9 h-9 text-blue-600" />
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2">Are you sure you want to logout?</h3>
          <p className="text-sm text-gray-500 mb-8 max-w-[280px]">
            You will be redirected to the login page. Any unsaved changes may be lost.
          </p>
        </div>

        {/* Các nút hành động (Ảnh 2) */}
        <div className="flex gap-4">
          <button 
            onClick={onClose} // Bấm Cancel -> Đóng modal
            className="flex-1 py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm} // Bấm Logout -> Gọi hàm xử lý logout thật
            className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}