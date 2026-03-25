// src/pages/Admin/UserManagement.jsx
import React, { useState } from 'react';

const UserManagement = () => {
  // 1. DATA MẪU (Đã thêm nhiều dữ liệu để test phân trang)
  const [users, setUsers] = useState([
    { id: 1, initials: 'AJ', name: 'Alex Johnson', email: 'alex@pcstore.com', role: 'Admin', status: 'Active', date: 'Oct 12, 2023' },
    { id: 2, initials: 'SC', name: 'Sarah Chen', email: 'sarah.c@staff.com', role: 'Staff', status: 'Active', date: 'Nov 05, 2023' },
    { id: 3, initials: 'MB', name: 'Michael Brown', email: 'm.brown@gmail.com', role: 'Customer', status: 'Inactive', date: 'Dec 01, 2023' },
    { id: 4, initials: 'ED', name: 'Emily Davis', email: 'emily.d@pcstore.com', role: 'Staff', status: 'Active', date: 'Jan 15, 2024' },
    { id: 5, initials: 'RW', name: 'Robert Wilson', email: 'robert.w@outlook.com', role: 'Customer', status: 'Pending', date: 'Feb 10, 2024' },
    { id: 6, initials: 'JD', name: 'John Doe', email: 'john@gmail.com', role: 'Customer', status: 'Active', date: 'Feb 12, 2024' },
    { id: 7, initials: 'AS', name: 'Anna Smith', email: 'anna@staff.com', role: 'Staff', status: 'Active', date: 'Feb 15, 2024' },
    { id: 8, initials: 'PL', name: 'Peter Lee', email: 'peter@pcstore.com', role: 'Admin', status: 'Active', date: 'Mar 01, 2024' },
    { id: 9, initials: 'KT', name: 'Kevin Tran', email: 'kevin@gmail.com', role: 'Customer', status: 'Pending', date: 'Mar 05, 2024' },
    { id: 10, initials: 'LM', name: 'Laura Moon', email: 'laura@gmail.com', role: 'Customer', status: 'Inactive', date: 'Mar 10, 2024' },
    { id: 11, initials: 'CH', name: 'Chris Hemsworth', email: 'chris@thor.com', role: 'Customer', status: 'Active', date: 'Mar 12, 2024' },
    { id: 12, initials: 'SJ', name: 'Steve Jobs', email: 'steve@apple.com', role: 'Customer', status: 'Inactive', date: 'Mar 15, 2024' },
  ]);

  // --- STATE CHO PHÂN TRANG ---
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  // --- STATE CHO EDIT MODAL ---
  const [editingUser, setEditingUser] = useState(null); // Lưu thông tin user đang được sửa

  // ==========================================
  // LOGIC PHÂN TRANG
  // ==========================================
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser); // Cắt mảng để lấy đúng 5 người
  const totalPages = Math.ceil(users.length / usersPerPage);

  const changePage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // ==========================================
  // LOGIC XÓA & SỬA
  // ==========================================
  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa người dùng này?")) {
      const updatedUsers = users.filter(user => user.id !== id);
      setUsers(updatedUsers);
      // Xử lý lỗi: Nếu xóa hết user ở trang cuối thì lùi lại 1 trang
      if (currentUsers.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const openEditModal = (user) => {
    setEditingUser({ ...user }); // Copy dữ liệu user vào form
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    // Cập nhật lại initials nếu đổi tên (Lấy chữ cái đầu của 2 từ đầu tiên)
    const nameParts = editingUser.name.split(' ');
    const newInitials = nameParts.length > 1 
      ? nameParts[0][0].toUpperCase() + nameParts[1][0].toUpperCase() 
      : nameParts[0][0].toUpperCase();

    const updatedUser = { ...editingUser, initials: newInitials };

    setUsers(users.map(u => (u.id === editingUser.id ? updatedUser : u)));
    setEditingUser(null); // Đóng Modal
  };

  // ==========================================
  // RENDER GIAO DIỆN
  // ==========================================
  return (
    <div className="space-y-6 relative">
      
      {/* Nút ở góc trên */}
      <div className="flex justify-end gap-3 mb-4">
        <button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
          Filter
        </button>
        <button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          Export CSV
        </button>
      </div>

      {/* BẢNG DỮ LIỆU */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email Address</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Created Date</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {/* LƯU Ý: Đã thay users.map thành currentUsers.map */}
            {currentUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                      {user.initials}
                    </div>
                    <span className="font-bold text-gray-900">{user.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-500">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${
                    user.role === 'Admin' ? 'bg-blue-100 text-blue-700' : 
                    user.role === 'Staff' ? 'bg-gray-100 text-gray-700' : 'bg-gray-50 text-gray-500 border border-gray-200'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 text-xs font-bold rounded-full flex items-center w-max gap-1.5 ${
                    user.status === 'Active' ? 'bg-green-100 text-green-700' : 
                    user.status === 'Inactive' ? 'bg-gray-100 text-gray-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      user.status === 'Active' ? 'bg-green-500' : user.status === 'Inactive' ? 'bg-gray-400' : 'bg-yellow-500'
                    }`}></span>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500">{user.date}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <button onClick={() => openEditModal(user)} className="text-blue-600 font-bold text-sm hover:underline">Edit</button>
                    <button onClick={() => handleDelete(user.id)} className="text-gray-400 hover:text-red-600 transition-colors">🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* CHÂN TRANG: PHÂN TRANG */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, users.length)} of {users.length} users
          </span>
          <div className="flex gap-1">
            {/* Nút lùi */}
            <button 
              onClick={() => changePage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`w-8 h-8 flex items-center justify-center border border-gray-200 rounded text-gray-500 hover:bg-gray-50 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {'<'}
            </button>
            
            {/* Tạo các nút số trang */}
            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1;
              return (
                <button 
                  key={page}
                  onClick={() => changePage(page)}
                  className={`w-8 h-8 flex items-center justify-center border rounded font-medium ${
                    currentPage === page 
                      ? 'border-blue-600 bg-blue-600 text-white font-bold' 
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              );
            })}

            {/* Nút tới */}
            <button 
              onClick={() => changePage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`w-8 h-8 flex items-center justify-center border border-gray-200 rounded text-gray-500 hover:bg-gray-50 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {'>'}
            </button>
          </div>
        </div>
      </div>

      {/* MODAL EDIT USER */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Edit User Info</h2>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                <input type="text" name="name" value={editingUser.name} onChange={handleEditChange} className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:border-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                <input type="email" name="email" value={editingUser.email} onChange={handleEditChange} className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:border-blue-500" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Role</label>
                  <select name="role" value={editingUser.role} onChange={handleEditChange} className="w-full p-2.5 border border-gray-300 rounded-lg bg-white outline-none focus:border-blue-500">
                    <option value="Admin">Admin</option>
                    <option value="Staff">Staff</option>
                    <option value="Customer">Customer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Status</label>
                  <select name="status" value={editingUser.status} onChange={handleEditChange} className="w-full p-2.5 border border-gray-300 rounded-lg bg-white outline-none focus:border-blue-500">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setEditingUser(null)} className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;