// src/pages/Admin/StaffManagement.jsx
import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';

const StaffManagement = () => {
  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State quản lý việc hiển thị Form thêm Staff
  const [isAddingStaff, setIsAddingStaff] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    fetchStaffs();
  }, []);

  const fetchStaffs = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/users');
      const allUsers = res.data?.data || res.data || [];
      const staffList = allUsers.filter(u => u.role?.toUpperCase() === 'STAFF');
      setStaffs(staffList);
    } catch (error) {
      console.error("Lỗi tải danh sách nhân viên:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Hàm xử lý tạo Staff mới (Đang chờ Backend)
  const handleCreateStaff = async (e) => {
    e.preventDefault();
    try {
      // Chúng ta sẽ gọi API này sau khi code xong Backend
      await axiosClient.post('/staffs', formData);
      alert("Cấp tài khoản Staff thành công!");
      setIsAddingStaff(false);
      setFormData({ username: '', email: '', password: '' });
      fetchStaffs();
    } catch (error) {
      alert(error.response?.data?.message || "Lỗi khi tạo tài khoản Staff");
    }
  };

  const handleUpdateSalary = async (userId, currentName) => {
    const newSalary = window.prompt(`Nhập mức lương mới (VNĐ) cho nhân viên ${currentName}:`);
    
    if (newSalary && !isNaN(newSalary)) {
      try {
        await axiosClient.patch('/staffs/salary', {
          userId: userId,
          salary: Number(newSalary)
        });
        alert("Cập nhật lương thành công!");
        fetchStaffs(); 
      } catch (error) {
        alert(error.response?.data?.message || "Lỗi cập nhật lương");
      }
    } else if (newSalary !== null) {
      alert("Vui lòng nhập một con số hợp lệ!");
    }
  };

  if (loading) return <div className="p-8 text-center font-bold text-blue-600">Đang tải dữ liệu nhân sự...</div>;

  // --- GIAO DIỆN FORM THÊM STAFF ---
  if (isAddingStaff) {
    return (
      <div className="p-8 max-w-lg mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Cấp tài khoản Nhân viên (Staff)</h2>
        <form onSubmit={handleCreateStaff} className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">Tên tài khoản (Username)</label>
            <input 
              type="text" name="username" value={formData.username} onChange={handleInputChange} 
              className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-100" required 
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Email liên hệ</label>
            <input 
              type="email" name="email" value={formData.email} onChange={handleInputChange} 
              className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-100" required 
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Mật khẩu khởi tạo</label>
            <input 
              type="text" name="password" value={formData.password} onChange={handleInputChange} 
              className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-100" 
              placeholder="VD: staff@123" required 
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t mt-6">
            <button type="button" onClick={() => setIsAddingStaff(false)} className="px-6 py-2 border rounded-lg font-bold text-gray-600 hover:bg-gray-50">Hủy</button>
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700">Tạo tài khoản</button>
          </div>
        </form>
      </div>
    );
  }

  // --- GIAO DIỆN BẢNG DANH SÁCH ---
  return (
    <div className="p-8 font-sans">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Nhân sự (Staff)</h1>
        <button 
          onClick={() => setIsAddingStaff(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 shadow-md"
        >
          + Cấp tài khoản Staff
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase border-b">
            <tr>
              <th className="px-6 py-4">Mã NV</th>
              <th className="px-6 py-4">Tên tài khoản</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4 text-center">Trạng thái</th>
              <th className="px-6 py-4 text-center">Nghiệp vụ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {staffs.map((s) => (
              <tr key={s.user_id || s.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-mono text-sm text-gray-400">#{s.user_id || s.id}</td>
                <td className="px-6 py-4 font-bold text-gray-900">{s.username}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{s.email || 'Chưa cập nhật'}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-2 py-1 text-[10px] font-bold rounded-full ${s.is_active !== 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {s.is_active !== 0 ? 'ĐANG LÀM VIỆC' : 'ĐÃ NGHỈ'}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button 
                    onClick={() => handleUpdateSalary(s.user_id || s.id, s.username)}
                    className="px-3 py-1 bg-yellow-100 text-yellow-700 border border-yellow-200 rounded text-xs font-bold hover:bg-yellow-200 transition-colors"
                  >
                    💵 Đổi Lương
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {staffs.length === 0 && <div className="p-8 text-center text-gray-500">Chưa có nhân viên nào trong hệ thống.</div>}
      </div>
    </div>
  );
};

export default StaffManagement;