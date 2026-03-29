// src/pages/Admin/AdminSettings.jsx
import React, { useState, useEffect } from 'react';
import { Camera, Lock, Mail, Bell, Sun, Moon, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import axiosClient from '../../api/axiosClient';

export default function AdminSettings() {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  
  const [profile, setProfile] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: ''
  });

  const [notifications, setNotifications] = useState({ email: true, push: false });
  const [theme, setTheme] = useState('light');

  // TỰ ĐỘNG LẤY DỮ LIỆU THẬT KHI LOAD TRANG
  useEffect(() => {
    const fetchMyProfile = async () => {
      try {
        const res = await axiosClient.get('/users/me');
        const data = res.data?.data || res.data;
        if (data) {
          setProfile({
            fullName: data.full_name || data.username || user?.name || '',
            email: data.email || user?.email || '',
            phone: data.phone_number || ''
          });
        }
      } catch (error) {
        console.error("Lỗi lấy thông tin:", error);
      }
    };
    fetchMyProfile();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  // HÀM LƯU THAY ĐỔI & HIỂN THỊ THÔNG BÁO TỪ BACKEND
  const handleSaveChanges = async () => {
    try {
      setIsSaving(true);
      const res = await axiosClient.patch('/users/me', {
        fullName: profile.fullName,
        email: profile.email,
        phone: profile.phone
      });
      
      // Lấy thông báo "Thành công" từ Backend
      alert(`✅ ${res.data?.message || 'Cập nhật hồ sơ thành công!'}`);
      
    } catch (error) {
      // Lấy thông báo "Lỗi" từ Backend
      const errorMsg = error.response?.data?.message || 'Lỗi hệ thống khi cập nhật!';
      alert(`❌ ${errorMsg}`);
    } finally {
      setIsSaving(false);
    }
  };

  const ToggleSwitch = ({ isOn, onToggle }) => (
    <div onClick={onToggle} className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${isOn ? 'bg-blue-600' : 'bg-gray-200'}`}>
      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${isOn ? 'translate-x-5' : 'translate-x-0'}`} />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Quản lý hồ sơ cá nhân và cài đặt hệ thống.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-lg">Hủy</button>
          
          {/* NÚT LƯU ĐÃ ĐƯỢC GẮN SỰ KIỆN */}
          <button 
            onClick={handleSaveChanges}
            disabled={isSaving}
            className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm ${isSaving ? 'opacity-50' : ''}`}
          >
            {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CỘT TRÁI: Hồ sơ Admin */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <h2 className="text-lg font-bold text-gray-800">Hồ sơ Quản trị viên</h2>
          <p className="text-sm text-gray-500 mb-6">Thông tin định danh trên hệ thống.</p>
          
          <div className="flex items-center gap-6 mb-8">
            <div className="relative group cursor-pointer">
              <div className="w-20 h-20 rounded-full border-4 border-gray-50 shadow-sm flex items-center justify-center bg-blue-100 text-blue-600 text-3xl font-bold">
                {profile.fullName ? profile.fullName.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full border-2 border-white"><Camera className="w-3.5 h-3.5" /></div>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-lg">{profile.fullName || 'Admin'}</h3>
              <p className="text-xs text-gray-500 mb-2">Vai trò: System Administrator</p>
            </div>
          </div>

          <div className="space-y-5 flex-1">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2">Họ và tên</label>
              <input type="text" name="fullName" value={profile.fullName} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2">Email hệ thống</label>
              <input type="email" name="email" value={profile.email} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2">Số điện thoại</label>
                <input type="text" name="phone" placeholder="Cập nhật SĐT" value={profile.phone} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2">Quyền hạn</label>
                <div className="relative">
                  <input type="text" value={user?.role?.toUpperCase() || 'ADMIN'} disabled className="w-full border border-gray-200 rounded-xl pl-4 py-2.5 text-sm bg-gray-100 cursor-not-allowed" />
                  <Lock className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: Bảo mật */}
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex-1">
            <h2 className="text-lg font-bold text-gray-800">System Preferences</h2>
            <div className="space-y-4 mt-6">
              <div className="flex justify-between items-center"><div className="flex gap-3"><Mail className="w-5 h-5 text-blue-500"/> <p className="font-bold text-sm">Báo cáo Email</p></div> <ToggleSwitch isOn={notifications.email} onToggle={() => setNotifications(p => ({...p, email: !p.email}))} /></div>
              <div className="flex justify-between items-center"><div className="flex gap-3"><Bell className="w-5 h-5 text-purple-500"/> <p className="font-bold text-sm">Cảnh báo trình duyệt</p></div> <ToggleSwitch isOn={notifications.push} onToggle={() => setNotifications(p => ({...p, push: !p.push}))} /></div>
            </div>
          </div>
          <div className="bg-red-50/50 rounded-2xl border border-red-100 p-6 flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-red-800 mb-1">Bảo mật tài khoản</h3>
              <p className="text-xs text-red-600 mb-4">Hãy đảm bảo mật khẩu an toàn và đăng xuất khi dùng máy lạ.</p>
              <div className="flex gap-4"><button className="text-xs font-bold text-red-700 hover:underline">Đổi mật khẩu</button></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}