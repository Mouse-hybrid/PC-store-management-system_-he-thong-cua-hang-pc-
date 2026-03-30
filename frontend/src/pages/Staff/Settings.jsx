// src/pages/Staff/Settings.jsx
import React, { useState, useEffect } from 'react';
import { Camera, Lock, Mail, Bell, AlertTriangle, ChevronDown, X } from 'lucide-react'; // 👉 THÊM IMPORT X
import { useAuth } from '../../contexts/AuthContext';
import axiosClient from '../../api/axiosClient';

export default function Settings() {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  
  const [profile, setProfile] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: ''
  });

  const [notifications, setNotifications] = useState({ email: true, push: false });
  const [language, setLanguage] = useState('English (United States)');

  // 👉 STATE CHO MODAL ĐỔI MẬT KHẨU
  const [showPwdModal, setShowPwdModal] = useState(false);
  const [isChangingPwd, setIsChangingPwd] = useState(false);
  const [pwdForm, setPwdForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
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
    fetchProfile();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      setIsSaving(true);
      const res = await axiosClient.patch('/users/me', {
        fullName: profile.fullName,
        email: profile.email,
        phone: profile.phone
      });
      alert(`✅ ${res.data?.message || 'Cập nhật hồ sơ thành công!'}`);
    } catch (error) {
      alert(`❌ ${error.response?.data?.message || 'Lỗi cập nhật hồ sơ!'}`);
    } finally {
      setIsSaving(false);
    }
  };

  // 👉 HÀM XỬ LÝ ĐỔI MẬT KHẨU CHO STAFF
  const submitPasswordChange = async (e) => {
    e.preventDefault();
    if (!pwdForm.oldPassword || !pwdForm.newPassword) return alert("Vui lòng nhập đầy đủ thông tin!");
    if (pwdForm.newPassword !== pwdForm.confirmPassword) return alert("❌ Mật khẩu xác nhận không khớp!");
    
    try {
      setIsChangingPwd(true);
      await axiosClient.patch('/users/change-password', {
        oldPassword: pwdForm.oldPassword,
        newPassword: pwdForm.newPassword
      });
      alert("✅ Đổi mật khẩu thành công!");
      setShowPwdModal(false);
      setPwdForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      alert(`❌ ${error.response?.data?.message || 'Lỗi khi đổi mật khẩu!'}`);
    } finally {
      setIsChangingPwd(false);
    }
  };

  const ToggleSwitch = ({ isOn, onToggle }) => (
    <div onClick={onToggle} className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ease-in-out ${isOn ? 'bg-blue-600' : 'bg-gray-200'}`}>
      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${isOn ? 'translate-x-5' : 'translate-x-0'}`} />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your profile and system preferences</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            Cancel
          </button>
          <button 
            onClick={handleSaveChanges}
            disabled={isSaving}
            className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm ${isSaving ? 'opacity-50' : ''}`}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <h2 className="text-lg font-bold text-gray-800">Account Profile</h2>
          <p className="text-sm text-gray-500 mb-6">Personal information and identity</p>
          
          <div className="flex items-center gap-6 mb-8">
            <div className="relative group cursor-pointer">
              <div className="w-20 h-20 rounded-full border-4 border-gray-50 shadow-sm flex items-center justify-center bg-blue-100 text-blue-600 text-3xl font-bold">
                {profile.fullName ? profile.fullName.charAt(0).toUpperCase() : 'S'}
              </div>
              <div className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full border-2 border-white shadow-sm">
                <Camera className="w-3.5 h-3.5" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-lg">{profile.fullName || 'Staff Member'}</h3>
              <p className="text-xs text-gray-500 mb-2">Role: System Staff</p>
            </div>
          </div>

          <div className="space-y-5 flex-1">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2">Full Name</label>
              <input type="text" name="fullName" value={profile.fullName} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-800 focus:ring-2 focus:ring-blue-100 outline-none"/>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2">Email Address</label>
              <input type="email" name="email" value={profile.email} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-800 focus:ring-2 focus:ring-blue-100 outline-none"/>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2">Phone Number</label>
                <input type="text" name="phone" value={profile.phone} onChange={handleInputChange} placeholder="Update phone" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-800 focus:ring-2 focus:ring-blue-100 outline-none"/>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2">Role</label>
                <div className="relative">
                  <input type="text" value={user?.role?.toUpperCase() || 'STAFF'} disabled className="w-full border border-gray-200 rounded-xl pl-4 pr-10 py-2.5 text-sm font-medium text-gray-400 bg-gray-100 cursor-not-allowed"/>
                  <Lock className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex-1">
            <h2 className="text-lg font-bold text-gray-800">System Preferences</h2>
            <p className="text-sm text-gray-500 mb-6">Manage notifications and display settings</p>
            
            <div className="mb-8">
              <p className="text-xs font-bold text-gray-400 uppercase mb-4">NOTIFICATIONS</p>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex gap-3 items-center">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Mail className="w-4 h-4" /></div>
                    <div><p className="text-sm font-bold text-gray-800">Email Notifications</p></div>
                  </div>
                  <ToggleSwitch isOn={notifications.email} onToggle={() => setNotifications(prev => ({ ...prev, email: !prev.email }))} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-3 items-center">
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Bell className="w-4 h-4" /></div>
                    <div><p className="text-sm font-bold text-gray-800">Browser Push</p></div>
                  </div>
                  <ToggleSwitch isOn={notifications.push} onToggle={() => setNotifications(prev => ({ ...prev, push: !prev.push }))} />
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-gray-400 uppercase mb-4">SYSTEM LANGUAGE</p>
              <div className="relative">
                <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 bg-gray-50 outline-none cursor-pointer">
                  <option>English (United States)</option>
                  <option>Vietnamese (Tiếng Việt)</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="bg-red-50/50 rounded-2xl border border-red-100 p-6 flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-red-800 mb-1">Security & Privacy</h3>
              <p className="text-xs text-red-600 mb-4 leading-relaxed">
                Change your password or manage your active sessions. Keeping your account secure is important for store data integrity.
              </p>
              <div className="flex gap-4">
                {/* 👉 NÚT KÍCH HOẠT MODAL CHO STAFF */}
                <button 
                  onClick={() => setShowPwdModal(true)}
                  className="text-xs font-bold text-red-700 hover:underline cursor-pointer"
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 👉 POPUP MODAL ĐỔI MẬT KHẨU */}
      {showPwdModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 transform transition-all">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">Change Password</h3>
              <button onClick={() => setShowPwdModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={submitPasswordChange} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Current Password</label>
                <input 
                  type="password" required
                  value={pwdForm.oldPassword} 
                  onChange={(e) => setPwdForm({...pwdForm, oldPassword: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 outline-none" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">New Password</label>
                <input 
                  type="password" required minLength="6"
                  value={pwdForm.newPassword} 
                  onChange={(e) => setPwdForm({...pwdForm, newPassword: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 outline-none" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Confirm New Password</label>
                <input 
                  type="password" required minLength="6"
                  value={pwdForm.confirmPassword} 
                  onChange={(e) => setPwdForm({...pwdForm, confirmPassword: e.target.value})}
                  className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:ring-2 outline-none ${pwdForm.confirmPassword && pwdForm.newPassword !== pwdForm.confirmPassword ? 'border-red-400 focus:ring-red-100' : 'border-gray-200 focus:ring-blue-100'}`} 
                />
                {pwdForm.confirmPassword && pwdForm.newPassword !== pwdForm.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">Passwords do not match.</p>
                )}
              </div>
              
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowPwdModal(false)} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isChangingPwd} className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors">
                  {isChangingPwd ? 'Processing...' : 'Confirm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}