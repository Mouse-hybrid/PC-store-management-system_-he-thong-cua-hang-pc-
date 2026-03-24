import React, { useState } from 'react';
import { Camera, Lock, Mail, Bell, Sun, Moon, AlertTriangle, ChevronDown } from 'lucide-react';

export default function Settings() {
  // --- STATE MANAGEMENT ---
  // 1. State cho thông tin cá nhân
  const [profile, setProfile] = useState({
    fullName: 'Alex Johnson',
    email: 'alex.j@pcstore.com',
    phone: '+1 (555) 000-1234'
  });

  // 2. State cho các công tắc thông báo
  const [notifications, setNotifications] = useState({
    email: true,
    push: false
  });

  // 3. State cho Giao diện (Theme) & Ngôn ngữ
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('English (United States)');

  // Hàm xử lý khi người dùng gõ vào form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  // Component phụ: Nút công tắc bật/tắt (Toggle Switch)
  const ToggleSwitch = ({ isOn, onToggle }) => (
    <div 
      onClick={onToggle}
      className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ease-in-out ${
        isOn ? 'bg-blue-600' : 'bg-gray-200'
      }`}
    >
      <div 
        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${
          isOn ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your profile and system preferences</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            Cancel
          </button>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm">
            Save Changes
          </button>
        </div>
      </div>

      {/* --- MAIN CONTENT GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CỘT TRÁI: Account Profile */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <h2 className="text-lg font-bold text-gray-800">Account Profile</h2>
          <p className="text-sm text-gray-500 mb-6">Personal information and identity</p>
          
          {/* Avatar Section */}
          <div className="flex items-center gap-6 mb-8">
            <div className="relative group cursor-pointer">
              <img 
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150" 
                alt="Profile" 
                className="w-20 h-20 rounded-full object-cover border-4 border-gray-50 shadow-sm transition-opacity group-hover:opacity-80"
              />
              <div className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full border-2 border-white shadow-sm">
                <Camera className="w-3.5 h-3.5" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-lg">Hoàng</h3>
              <p className="text-xs text-gray-500 mb-2">JPG, GIF or PNG. Max size 2MB</p>
              <button className="text-sm font-semibold text-blue-600 hover:underline">Upload new photo</button>
            </div>
          </div>

          {/* Form Inputs */}
          <div className="space-y-5 flex-1">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2">Full Name</label>
              <input 
                type="text" name="fullName" value={profile.fullName} onChange={handleInputChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2">Email Address</label>
              <input 
                type="email" name="email" value={profile.email} onChange={handleInputChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2">Phone Number</label>
                <input 
                  type="text" name="phone" value={profile.phone} onChange={handleInputChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2">Role</label>
                <div className="relative">
                  <input 
                    type="text" value="Store Manager" disabled
                    className="w-full border border-gray-200 rounded-xl pl-4 pr-10 py-2.5 text-sm font-medium text-gray-400 bg-gray-100 cursor-not-allowed"
                  />
                  <Lock className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: System Preferences */}
        <div className="flex flex-col gap-6">
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex-1">
            <h2 className="text-lg font-bold text-gray-800">System Preferences</h2>
            <p className="text-sm text-gray-500 mb-6">Manage notifications and display settings</p>
            
            {/* Notifications Section */}
            <div className="mb-8">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">NOTIFICATIONS</p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex gap-3 items-center">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Mail className="w-4 h-4" /></div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">Email Notifications</p>
                      <p className="text-xs text-gray-500">Daily summaries and order alerts</p>
                    </div>
                  </div>
                  <ToggleSwitch 
                    isOn={notifications.email} 
                    onToggle={() => setNotifications(prev => ({ ...prev, email: !prev.email }))} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex gap-3 items-center">
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Bell className="w-4 h-4" /></div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">Browser Push</p>
                      <p className="text-xs text-gray-500">Real-time alerts in your browser</p>
                    </div>
                  </div>
                  <ToggleSwitch 
                    isOn={notifications.push} 
                    onToggle={() => setNotifications(prev => ({ ...prev, push: !prev.push }))} 
                  />
                </div>
              </div>
            </div>

            {/* Appearance Section */}
            <div className="mb-8">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">APPEARANCE</p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setTheme('light')}
                  className={`flex-1 py-4 border-2 rounded-xl flex flex-col items-center gap-2 transition-all ${
                    theme === 'light' ? 'border-blue-600 bg-blue-50/30' : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <Sun className={`w-6 h-6 ${theme === 'light' ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span className={`text-sm font-bold ${theme === 'light' ? 'text-blue-700' : 'text-gray-600'}`}>Light Mode</span>
                  {theme === 'light' && <div className="w-2 h-2 rounded-full bg-blue-600 mt-1"></div>}
                </button>
                
                <button 
                  onClick={() => setTheme('dark')}
                  className={`flex-1 py-4 border-2 rounded-xl flex flex-col items-center gap-2 transition-all ${
                    theme === 'dark' ? 'border-blue-600 bg-blue-50/30' : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <Moon className={`w-6 h-6 ${theme === 'dark' ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span className={`text-sm font-bold ${theme === 'dark' ? 'text-blue-700' : 'text-gray-600'}`}>Dark Mode</span>
                  {theme === 'dark' && <div className="w-2 h-2 rounded-full bg-blue-600 mt-1"></div>}
                </button>
              </div>
            </div>

            {/* Language Section */}
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">SYSTEM LANGUAGE</p>
              <div className="relative">
                <select 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer"
                >
                  <option>English (United States)</option>
                  <option>Vietnamese (Tiếng Việt)</option>
                  <option>French (Français)</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Security & Privacy Card */}
          <div className="bg-red-50/50 rounded-2xl border border-red-100 p-6 flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-red-800 mb-1">Security & Privacy</h3>
              <p className="text-xs text-red-600 mb-4 leading-relaxed">
                Change your password or manage your active sessions. Keeping your account secure is important for store data integrity.
              </p>
              <div className="flex gap-4">
                <button className="text-xs font-bold text-red-700 hover:text-red-800 hover:underline">Change Password</button>
                <button className="text-xs font-bold text-red-700 hover:text-red-800 hover:underline">Log out from all devices</button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* --- FOOTER ACTIONS --- */}
      <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
        <button className="px-6 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
          Cancel Changes
        </button>
        <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm">
          Save Settings
        </button>
      </div>

    </div>
  );
}