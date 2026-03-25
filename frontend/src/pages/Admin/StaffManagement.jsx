// src/pages/Admin/StaffManagement.jsx
import React, { useState } from 'react';

const StaffManagement = () => {
  // 1. DATA MẪU (Thêm nhiều data để test phân trang 4 người/trang)
  const [staffList, setStaffList] = useState([
    { id: 1, avatar: '🧑🏻', name: 'Hoàng', joined: 'Joined Aug 2021', role: 'Store Manager', email: 'alex@pcstore.com', status: 'Active' },
    { id: 2, avatar: '👩🏼', name: 'Sarah Smith', joined: 'Joined Dec 2022', role: 'Technician', email: 'sarah@pcstore.com', status: 'Active' },
    { id: 3, avatar: '👨🏽', name: 'Mike Brown', joined: 'Joined Jan 2023', role: 'Sales Associate', email: 'mike@pcstore.com', status: 'On Leave' },
    { id: 4, avatar: '👩🏻‍🦰', name: 'Emily Davis', joined: 'Joined Feb 2023', role: 'Support', email: 'emily@pcstore.com', status: 'Inactive' },
    { id: 5, avatar: '👨🏻‍💻', name: 'David Lee', joined: 'Joined Mar 2023', role: 'Technician', email: 'david@pcstore.com', status: 'Active' },
    { id: 6, avatar: '👩🏽‍💼', name: 'Linda Tran', joined: 'Joined May 2023', role: 'Sales Associate', email: 'linda@pcstore.com', status: 'Active' },
    { id: 7, avatar: '🧔🏻', name: 'Tom Hardy', joined: 'Joined Jul 2023', role: 'Support', email: 'tom@pcstore.com', status: 'On Leave' },
    { id: 8, avatar: '👱🏻‍♀️', name: 'Emma Watson', joined: 'Joined Sep 2023', role: 'Store Manager', email: 'emma@pcstore.com', status: 'Active' },
    { id: 9, avatar: '👨🏾‍🦱', name: 'Will Smith', joined: 'Joined Nov 2023', role: 'Technician', email: 'will@pcstore.com', status: 'Inactive' },
  ]);

  // --- STATE CHO PHÂN TRANG ---
  const [currentPage, setCurrentPage] = useState(1);
  const staffPerPage = 4; // Giống trong hình của bạn là 4 người/trang

  // --- STATE CHO MODAL (THÊM / SỬA) ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null); // Lưu ID nếu đang sửa, null nếu thêm mới
  const [formData, setFormData] = useState({ name: '', role: 'Technician', email: '', status: 'Active' });

  // ==========================================
  // LOGIC PHÂN TRANG
  // ==========================================
  const indexOfLastStaff = currentPage * staffPerPage;
  const indexOfFirstStaff = indexOfLastStaff - staffPerPage;
  const currentStaffs = staffList.slice(indexOfFirstStaff, indexOfLastStaff);
  const totalPages = Math.ceil(staffList.length / staffPerPage);

  const changePage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // ==========================================
  // THỐNG KÊ ĐỘNG (Tự động tính toán)
  // ==========================================
  const totalStaff = staffList.length;
  const activeStaff = staffList.filter(s => s.status === 'Active').length;
  const onLeaveStaff = staffList.filter(s => s.status === 'On Leave').length;

  // ==========================================
  // LOGIC XÓA, THÊM, SỬA
  // ==========================================
  const handleDelete = (id) => {
    if (window.confirm("Xóa nhân viên này khỏi hệ thống?")) {
      const updatedList = staffList.filter(staff => staff.id !== id);
      setStaffList(updatedList);
      if (currentStaffs.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Mở Modal Thêm mới
  const openAddModal = () => {
    setFormData({ name: '', role: 'Technician', email: '', status: 'Active' });
    setEditingId(null);
    setIsModalOpen(true);
  };

  // Mở Modal Chỉnh sửa
  const openEditModal = (staff) => {
    setFormData({ name: staff.name, role: staff.role, email: staff.email, status: staff.status });
    setEditingId(staff.id);
    setIsModalOpen(true);
  };

  // Lưu dữ liệu
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingId) {
      // ĐANG SỬA
      setStaffList(staffList.map(staff => 
        staff.id === editingId ? { ...staff, ...formData } : staff
      ));
    } else {
      // ĐANG THÊM MỚI
      const avatars = ['🧑🏻', '👩🏼', '👨🏽', '👩🏻‍🦰', '👨🏻‍💻', '👩🏽‍💼', '🧔🏻', '👱🏻‍♀️'];
      const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
      
      // Lấy tháng năm hiện tại cho "Joined"
      const date = new Date();
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const joinedString = `Joined ${monthNames[date.getMonth()]} ${date.getFullYear()}`;

      const newStaff = {
        id: Date.now(),
        avatar: randomAvatar,
        joined: joinedString,
        ...formData
      };
      
      // Thêm nhân viên mới lên ĐẦU danh sách
      setStaffList([newStaff, ...staffList]);
    }
    
    setIsModalOpen(false); // Đóng Modal
  };

  // ==========================================
  // RENDER GIAO DIỆN
  // ==========================================
  return (
    <div className="space-y-6 relative">
      {/* Nút Thêm Mới */}
      <div className="flex justify-end mb-4">
        <button onClick={openAddModal} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 flex items-center gap-2 transition-colors">
          <span>+</span> Add New Staff
        </button>
      </div>

      {/* BẢNG DỮ LIỆU */}
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
            {currentStaffs.map((staff) => (
              <tr key={staff.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl">
                      {staff.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{staff.name}</p>
                      <p className="text-xs text-gray-400">{staff.joined}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 text-xs font-bold text-gray-600 bg-gray-100 rounded-full border border-gray-200">
                    {staff.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500">{staff.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 text-xs font-bold rounded-full flex items-center w-max gap-1.5 ${
                    staff.status === 'Active' ? 'bg-green-100 text-green-700' : 
                    staff.status === 'Inactive' ? 'bg-gray-100 text-gray-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      staff.status === 'Active' ? 'bg-green-500' : staff.status === 'Inactive' ? 'bg-gray-400' : 'bg-yellow-500'
                    }`}></span>
                    {staff.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-4">
                    <button onClick={() => openEditModal(staff)} className="text-gray-400 hover:text-orange-500 transition-colors" title="Edit">✏️</button>
                    <button onClick={() => handleDelete(staff.id)} className="text-gray-400 hover:text-red-600 transition-colors" title="Delete">🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* PHÂN TRANG */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Showing {staffList.length === 0 ? 0 : indexOfFirstStaff + 1} to {Math.min(indexOfLastStaff, staffList.length)} of {staffList.length} results
          </span>
          <div className="flex gap-1">
            <button 
              onClick={() => changePage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`w-8 h-8 flex items-center justify-center border border-gray-200 rounded text-gray-500 hover:bg-gray-50 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {'<'}
            </button>
            
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

            <button 
              onClick={() => changePage(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`w-8 h-8 flex items-center justify-center border border-gray-200 rounded text-gray-500 hover:bg-gray-50 ${currentPage === totalPages || totalPages === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {'>'}
            </button>
          </div>
        </div>
      </div>

      {/* THỐNG KÊ (Dynamic Stats) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-xl">👥</div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Staff</p>
            <p className="text-2xl font-bold text-gray-900">{totalStaff}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-lg flex items-center justify-center text-xl">✅</div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active Now</p>
            <p className="text-2xl font-bold text-gray-900">{activeStaff}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-lg flex items-center justify-center text-xl">⏳</div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">On Leave</p>
            <p className="text-2xl font-bold text-gray-900">{onLeaveStaff}</p>
          </div>
        </div>
      </div>

      {/* MODAL THÊM/SỬA NHÂN VIÊN */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Staff Details' : 'Add New Staff'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. John Doe" className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:border-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Email Address <span className="text-red-500">*</span></label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="staff@pcstore.com" className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:border-blue-500" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Role</label>
                  <select name="role" value={formData.role} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 rounded-lg bg-white outline-none focus:border-blue-500">
                    <option value="Store Manager">Store Manager</option>
                    <option value="Technician">Technician</option>
                    <option value="Sales Associate">Sales Associate</option>
                    <option value="Support">Support</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Status</label>
                  <select name="status" value={formData.status} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 rounded-lg bg-white outline-none focus:border-blue-500">
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">
                  {editingId ? 'Save Changes' : 'Add Staff'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;