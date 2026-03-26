// src/pages/Staff/Customers.jsx
import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, Edit3, MessageSquare, Mail, Phone, MapPin, 
  Monitor, Filter, Download, Eye, MoreVertical, ChevronLeft, RefreshCw
} from 'lucide-react';
import axiosClient from '../../api/axiosClient';

export default function Customers() {
  const [view, setView] = useState('list'); // 'list' hoặc 'detail'
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  // 1. LẤY DANH SÁCH KHÁCH HÀNG (MEMBER)
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/users');
      const allUsers = res.data?.data || res.data || [];
      // Chỉ lọc những người là khách hàng (MEMBER)
      setCustomers(allUsers.filter(u => u.role?.toUpperCase() === 'MEMBER'));
    } catch (error) {
      console.error("Lỗi tải danh sách khách hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. XEM CHI TIẾT VÀ TẢI ĐƠN HÀNG CỦA KHÁCH ĐÓ
  const handleViewDetail = async (customer) => {
    setSelectedCustomer(customer);
    setView('detail');
    try {
      // Gọi API lấy toàn bộ đơn hàng và lọc theo user_id (dựa trên order.js logic)
      const res = await axiosClient.get('/orders');
      const allOrders = res.data?.data || res.data || [];
      const userOrders = allOrders.filter(o => o.user_id === customer.user_id);
      setCustomerOrders(userOrders);
    } catch (error) {
      console.error("Lỗi tải đơn hàng khách hàng:", error);
    }
  };

  if (loading && view === 'list') return <div className="p-8 text-center font-bold text-blue-600">Đang tải danh sách khách hàng...</div>;

  // --- GIAO DIỆN 1: DANH SÁCH KHÁCH HÀNG ---
  if (view === 'list') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Khách hàng</h1>
          <button onClick={fetchCustomers} className="p-2 bg-white border rounded-lg hover:bg-gray-50">
            <RefreshCw className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50/50 font-semibold text-gray-400 uppercase tracking-wider">
                <th className="p-4 pl-6">Khách hàng</th>
                <th className="p-4">Liên hệ</th>
                <th className="p-4">Địa chỉ</th>
                <th className="p-4 text-center">Trạng thái</th>
                <th className="p-4 pr-6 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {customers.map((c) => (
                <tr key={c.user_id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                        {(c.full_name || c.username).charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{c.full_name || c.username}</p>
                        <p className="text-xs text-gray-500">@{c.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-gray-800">{c.email}</p>
                    <p className="text-xs text-gray-500">{c.phone_number || 'Chưa có SĐT'}</p>
                  </td>
                  <td className="p-4 text-gray-600 max-w-[200px] truncate">
                    {c.shipping_address || 'Chưa cập nhật'}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${c.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {c.is_active ? 'ACTIVE' : 'LOCKED'}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-center">
                    <button 
                      onClick={() => handleViewDetail(c)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg font-bold text-xs flex items-center gap-1 mx-auto"
                    >
                      <Eye className="w-4 h-4" /> Xem hồ sơ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {customers.length === 0 && <div className="p-10 text-center text-gray-400">Chưa có thành viên nào đăng ký.</div>}
        </div>
      </div>
    );
  }

  // --- GIAO DIỆN 2: HỒ SƠ CHI TIẾT (DỮ LIỆU THẬT) ---
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <button 
        onClick={() => setView('list')}
        className="flex items-center gap-2 text-gray-500 hover:text-blue-600 font-semibold transition-colors"
      >
        <ChevronLeft className="w-5 h-5" /> Quay lại danh sách
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl font-bold border-4 border-white shadow-sm">
              {(selectedCustomer.full_name || selectedCustomer.username).charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-gray-800">{selectedCustomer.full_name || selectedCustomer.username}</h1>
                {selectedCustomer.is_active && (
                   <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-1 rounded-md uppercase">Verified</span>
                )}
              </div>
              <p className="text-sm text-gray-500 flex items-center gap-2">
                 Thành viên từ: {new Date(selectedCustomer.created_at).toLocaleDateString('vi-VN')}
              </p>
            </div>
          </div>

          <div className="flex gap-8 bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800">{customerOrders.length}</p>
              <p className="text-xs font-semibold text-gray-500 uppercase mt-1">Đơn hàng</p>
            </div>
            <div className="w-px bg-gray-200"></div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {new Intl.NumberFormat('vi-VN').format(customerOrders.reduce((sum, o) => sum + Number(o.final_amount), 0))} ₫
              </p>
              <p className="text-xs font-semibold text-gray-500 uppercase mt-1">Tổng chi tiêu</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><Mail className="w-4 h-4" /></span>
            Thông tin liên hệ
          </h3>
          <div className="space-y-6">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase mb-1">Email</p>
              <p className="font-semibold text-gray-800">{selectedCustomer.email}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase mb-1">Số điện thoại</p>
              <p className="font-semibold text-gray-800">{selectedCustomer.phone_number || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase mb-1">Địa chỉ mặc định</p>
              <p className="font-semibold text-gray-800">{selectedCustomer.shipping_address || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="font-bold text-gray-800">Lịch sử đơn hàng gần đây</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-gray-50/50 font-semibold text-gray-400 uppercase">
                  <th className="p-4 pl-6">Mã Đơn</th>
                  <th className="p-4">Ngày đặt</th>
                  <th className="p-4">Trạng thái</th>
                  <th className="p-4 pr-6 text-right">Tổng tiền</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {customerOrders.map((order) => (
                  <tr key={order.order_id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 pl-6 font-bold text-blue-600">#{order.order_id}</td>
                    <td className="p-4">{new Date(order.created_at).toLocaleDateString('vi-VN')}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${order.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right font-bold">
                       {new Intl.NumberFormat('vi-VN').format(order.final_amount)} ₫
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {customerOrders.length === 0 && <div className="p-10 text-center text-gray-400">Khách hàng chưa có đơn hàng nào.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}