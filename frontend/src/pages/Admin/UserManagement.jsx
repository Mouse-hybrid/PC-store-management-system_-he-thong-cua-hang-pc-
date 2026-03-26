// src/pages/Admin/UserManagement.jsx
import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/users');
      
      // ĐÃ SỬA: Bao quát mọi trường hợp trả về của Axios để 100% bắt được data
      const dataList = res.data?.data || res.data || res || [];
      
      setUsers(Array.isArray(dataList) ? dataList : []);
    } catch (error) {
      console.error("Lỗi tải danh sách người dùng:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (role) => {
    const roleUpper = role?.toUpperCase();
    switch (roleUpper) {
      case 'ADMIN': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'STAFF': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200'; // MEMBER
    }
  };

  if (loading) return <div className="p-8 text-center font-bold text-blue-600">Đang tải dữ liệu người dùng...</div>;

  return (
    <div className="p-8 font-sans">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Người Dùng</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase border-b">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Tài khoản (Username)</th>
              <th className="px-6 py-4">Email liên hệ</th>
              <th className="px-6 py-4 text-center">Vai trò</th>
              <th className="px-6 py-4 text-center">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((u) => (
              <tr key={u.user_id || u.id} className={`hover:bg-gray-50 ${u.is_active === 0 ? 'opacity-50 bg-gray-50' : ''}`}>
                <td className="px-6 py-4 font-mono text-sm text-gray-400">#{u.user_id || u.id}</td>
                <td className="px-6 py-4 font-bold text-gray-900">
                  {u.username}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {u.email || 'Chưa cập nhật'}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getRoleBadge(u.role)}`}>
                    {u.role?.toUpperCase() || 'MEMBER'}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-2 py-1 text-[10px] font-bold rounded-full ${
                    u.is_active !== 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {u.is_active !== 0 ? 'ACTIVE' : 'LOCKED'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && <div className="p-8 text-center text-gray-500">Hệ thống chưa có người dùng nào.</div>}
      </div>
    </div>
  );
};

export default UserManagement;