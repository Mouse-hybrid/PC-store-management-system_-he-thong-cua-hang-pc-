// src/pages/Admin/PromotionManagement.jsx
import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';

const PromotionManagement = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const [formData, setFormData] = useState({
    coupon_code: '', discount_value: '', min_order_value: '', max_discount: '', valid_until: '', usage_limit: ''
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/coupons');
      setCoupons(res.data?.data || res.data || []);
    } catch (error) {
      console.error("Lỗi tải danh sách mã giảm giá:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post('/coupons', {
        coupon_code: formData.coupon_code.toUpperCase(),
        discount_value: parseInt(formData.discount_value),
        min_order_value: formData.min_order_value ? parseInt(formData.min_order_value) : null,
        max_discount: formData.max_discount ? parseInt(formData.max_discount) : null,
        expired_date: formData.valid_until ? formData.valid_until : undefined, 
        usage_limit: formData.usage_limit ? parseInt(formData.usage_limit) : null
      });
      alert("Đã tạo mã giảm giá thành công!");
      setIsAddingNew(false);
      setFormData({ coupon_code: '', discount_value: '', min_order_value: '', max_discount: '', valid_until: '', usage_limit: '' });
      fetchCoupons();
    } catch (error) {
      alert(error.response?.data?.message || "Lỗi tạo mã giảm giá");
    }
  };

  const toggleStatus = async (code) => {
    try {
      await axiosClient.patch(`/coupons/${code}/toggle`);
      fetchCoupons(); // Load lại data để cập nhật nút Bật/Tắt
    } catch (error) {
      alert("Lỗi khi thay đổi trạng thái mã");
    }
  };

  if (loading && coupons.length === 0) return <div className="p-8 text-center font-bold">Đang tải cấu hình khuyến mãi...</div>;

  if (isAddingNew) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Tạo mã giảm giá mới</h2>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2">Mã Coupon (Code)</label>
              <input type="text" name="coupon_code" value={formData.coupon_code} onChange={handleInputChange} className="w-full p-3 border rounded-lg uppercase" placeholder="VD: SUMMER2024" required />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Giá trị giảm (VNĐ)</label>
              <input type="number" name="discount_value" value={formData.discount_value} onChange={handleInputChange} className="w-full p-3 border rounded-lg" required />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2">Đơn tối thiểu để áp dụng</label>
              <input type="number" name="min_order_value" value={formData.min_order_value} onChange={handleInputChange} className="w-full p-3 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Giảm tối đa (Nếu cần)</label>
              <input type="number" name="max_discount" value={formData.max_discount} onChange={handleInputChange} className="w-full p-3 border rounded-lg" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2">Số lượt dùng tối đa</label>
              <input type="number" name="usage_limit" value={formData.usage_limit} onChange={handleInputChange} className="w-full p-3 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Ngày hết hạn</label>
              <input type="date" name="valid_until" value={formData.valid_until} onChange={handleInputChange} className="w-full p-3 border rounded-lg" />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={() => setIsAddingNew(false)} className="px-6 py-2 border rounded-lg font-bold text-gray-600 hover:bg-gray-50">Hủy</button>
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700">Tạo mã</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Khuyến Mãi & Coupon</h1>
        <button onClick={() => setIsAddingNew(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 shadow-md">
          + Thêm mã Coupon
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase border-b">
            <tr>
              <th className="px-6 py-4">Mã Code</th>
              <th className="px-6 py-4">Mức giảm</th>
              <th className="px-6 py-4">Điều kiện</th>
              <th className="px-6 py-4">Lượt dùng</th>
              <th className="px-6 py-4">Hạn dùng</th>
              <th className="px-6 py-4 text-center">Tắt / Bật</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {coupons.map((c) => (
              <tr key={c.code} className={`hover:bg-gray-50 ${!c.is_active && 'opacity-50'}`}>
                <td className="px-6 py-4 font-mono font-bold text-blue-600 text-lg">{c.code}</td>
                <td className="px-6 py-4 font-bold text-green-600">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(c.value || c.discount_value)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  Đơn từ: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(c.min_order_value || 0)}
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  {c.used_count || 0} / {c.usage_limit || '∞'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {c.valid_until ? new Date(c.valid_until).toLocaleDateString('vi-VN') : 'Vĩnh viễn'}
                </td>
                <td className="px-6 py-4 text-center">
                  {/* CÔNG TẮC GẠT MỞ/KHÓA MÃ */}
                  <button 
                    onClick={() => toggleStatus(c.code)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${c.is_active ? 'bg-blue-600' : 'bg-gray-300'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${c.is_active ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {coupons.length === 0 && <div className="p-8 text-center text-gray-500">Chưa có mã giảm giá nào.</div>}
      </div>
    </div>
  );
};

export default PromotionManagement;