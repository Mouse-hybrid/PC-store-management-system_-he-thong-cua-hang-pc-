// src/pages/Admin/AdminSettings.jsx
import React, { useState } from 'react';

const AdminSettings = () => {
  const [emailNotif, setEmailNotif] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  return (
    <div className="max-w-5xl mx-auto h-full flex flex-col">
      {/* --- Header --- */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Settings</h1>
          <p className="text-sm text-gray-500">Manage global system configurations and admin profile</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-lg">Cancel</button>
          <button className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">Save Changes</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-8">
        
        {/* --- Cột Trái: Thông tin cá nhân Admin --- */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-1">Admin Profile</h2>
            <p className="text-xs text-gray-500 mb-6">Your personal executive account</p>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                A
              </div>
              <div>
                <p className="font-bold text-gray-900">Alex Admin</p>
                <p className="text-xs text-gray-500 mb-1">Super Administrator</p>
                <button className="text-sm text-blue-600 font-bold hover:underline">Change Avatar</button>
              </div>
            </div>

            <div className="space-y-4 text-sm font-medium">
              <div>
                <label className="block text-gray-700 mb-1">Full Name</label>
                <input type="text" defaultValue="Alex Admin" className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none" />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Email Address</label>
                <input type="email" defaultValue="admin@pcstore.com" className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none" />
              </div>
            </div>
          </div>

          {/* Cấu hình cửa hàng (Chỉ Admin mới có) */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Store Configuration</h2>
            <div className="space-y-4 text-sm font-medium">
              <div>
                <label className="block text-gray-700 mb-1">Store Name</label>
                <input type="text" defaultValue="PC STORE OFFICIAL" className="w-full p-2.5 border border-gray-200 rounded-lg" />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-gray-700 mb-1">Currency</label>
                  <select className="w-full p-2.5 border border-gray-200 rounded-lg bg-white">
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                    <option>VND (₫)</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-gray-700 mb-1">Tax Rate (%)</label>
                  <input type="number" defaultValue="8" className="w-full p-2.5 border border-gray-200 rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- Cột Phải: Cấu hình hệ thống --- */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-6">System Preferences</h2>
            
            {/* Toggles */}
            <div className="space-y-6 mb-8">
              
              <div className="flex items-center justify-between">
                <div className="flex gap-3">
                  <span className="text-blue-500 bg-blue-50 p-2 rounded-lg">📧</span>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">System Alerts</p>
                    <p className="text-xs text-gray-500">Get emails for critical system errors</p>
                  </div>
                </div>
                {/* Nút Toggle */}
                <button 
                  onClick={() => setEmailNotif(!emailNotif)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${emailNotif ? 'bg-blue-600' : 'bg-gray-200'}`}
                >
                  <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${emailNotif ? 'translate-x-5' : 'translate-x-0'}`}></span>
                </button>
              </div>

              <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                <div className="flex gap-3">
                  <span className="text-orange-500 bg-orange-50 p-2 rounded-lg">🚧</span>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Maintenance Mode</p>
                    <p className="text-xs text-gray-500">Temporarily disable customer access</p>
                  </div>
                </div>
                {/* Nút Toggle Bảo trì */}
                <button 
                  onClick={() => setMaintenanceMode(!maintenanceMode)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${maintenanceMode ? 'bg-orange-500' : 'bg-gray-200'}`}
                >
                  <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${maintenanceMode ? 'translate-x-5' : 'translate-x-0'}`}></span>
                </button>
              </div>

            </div>
          </div>

          {/* Security Box */}
          <div className="bg-red-50 border border-red-100 p-6 rounded-xl">
            <h3 className="font-bold text-red-700 flex items-center gap-2 mb-2">⚠️ Master Security</h3>
            <p className="text-xs text-red-600 mb-4">You have super admin privileges. Changing passwords or active sessions here affects the entire root access.</p>
            <div className="flex gap-4 text-sm font-bold">
              <button className="text-red-700 hover:underline">Change Master Password</button>
              <button className="text-red-700 hover:underline">Terminate All Staff Sessions</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminSettings;