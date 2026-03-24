// src/pages/Admin/StaffManagement.jsx
import React from 'react';

const StaffManagement = () => {
  const staffList = [
    { name: 'Hoàng', role: 'Store Manager', email: 'alex@pcstore.com', status: 'Active', joined: 'Aug 2021', avatar: '/avatar1.jpg' },
    { name: 'Sarah Smith', role: 'Technician', email: 'sarah@pcstore.com', status: 'Active', joined: 'Dec 2022', avatar: '/avatar2.jpg' },
    { name: 'Mike Brown', role: 'Sales Associate', email: 'mike@pcstore.com', status: 'On Leave', joined: 'Jan 2023', avatar: '/avatar3.jpg' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700">+ Add New Staff</button>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {staffList.map((staff, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={staff.avatar} alt="Avatar" className="w-10 h-10 rounded-full bg-gray-200 object-cover" />
                    <div>
                      <p className="font-bold text-gray-900">{staff.name}</p>
                      <p className="text-xs text-gray-500">Joined {staff.joined}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">{staff.role}</span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{staff.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-bold rounded-full ${staff.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    ● {staff.status}
                  </span>
                </td>
                <td className="px-6 py-4 flex justify-center gap-2">
                  <button className="text-gray-400 hover:text-blue-600">✏️</button>
                  <button className="text-gray-400 hover:text-red-600">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bottom Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="bg-white p-6 rounded-xl border border-gray-200 flex items-center gap-4">
          <div className="bg-blue-50 text-blue-600 p-3 rounded-lg text-xl">👥</div>
          <div><p className="text-xs font-bold text-gray-400 uppercase">Total Staff</p><p className="text-2xl font-bold text-gray-900">24</p></div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 flex items-center gap-4">
          <div className="bg-green-50 text-green-600 p-3 rounded-lg text-xl">☑️</div>
          <div><p className="text-xs font-bold text-gray-400 uppercase">Active Now</p><p className="text-2xl font-bold text-gray-900">18</p></div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 flex items-center gap-4">
          <div className="bg-yellow-50 text-yellow-600 p-3 rounded-lg text-xl">⏳</div>
          <div><p className="text-xs font-bold text-gray-400 uppercase">Pending Approval</p><p className="text-2xl font-bold text-gray-900">2</p></div>
        </div>
      </div>
    </div>
  );
};

export default StaffManagement;