import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const url = filterStatus ? `/orders?status=${filterStatus}` : '/orders';
      const res = await axiosClient.get(url);
      setOrders(res.data || []);
    } catch (error) {
      console.error("Lỗi tải đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, action) => {
    try {
      // Gọi các API PATCH tương ứng: verify, ship, complete, cancel
      await axiosClient.patch(`/orders/${orderId}/${action}`);
      alert(`Đã cập nhật trạng thái đơn hàng #${orderId} thành công!`);
      fetchOrders(); // Tải lại danh sách
    } catch (error) {
      alert(error.response?.data?.message || "Lỗi cập nhật trạng thái");
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-700';
      case 'PENDING': return 'bg-yellow-100 text-yellow-700';
      case 'SHIPPED': return 'bg-blue-100 text-blue-700';
      case 'CANCELLED': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Đơn hàng</h1>
        <select 
          className="p-2 border rounded-lg bg-white outline-none font-medium"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="PENDING">Chờ xử lý</option>
          <option value="SHIPPED">Đang giao</option>
          <option value="COMPLETED">Hoàn tất</option>
          <option value="CANCELLED">Đã hủy</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase border-b">
            <tr>
              <th className="px-6 py-4">Mã đơn</th>
              <th className="px-6 py-4">Khách hàng</th>
              <th className="px-6 py-4">Tổng tiền</th>
              <th className="px-6 py-4">Trạng thái</th>
              <th className="px-6 py-4">Ngày đặt</th>
              <th className="px-6 py-4">Thao tác nhanh</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr key={order.order_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-bold">#{order.order_id}</td>
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-gray-900">{order.guest_name || 'Khách vãng lai'}</p>
                  <p className="text-xs text-gray-400">{order.guest_phone}</p>
                </td>
                <td className="px-6 py-4 font-bold text-blue-600">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.final_amount)}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${getStatusStyle(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(order.created_at).toLocaleDateString('vi-VN')}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {order.status === 'PENDING' && (
                      <button onClick={() => updateStatus(order.order_id, 'verify')} className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600">Xác nhận</button>
                    )}
                    {order.status === 'PENDING' && (
                      <button onClick={() => updateStatus(order.order_id, 'ship')} className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600">Giao hàng</button>
                    )}
                    {order.status === 'SHIPPED' && (
                      <button onClick={() => updateStatus(order.order_id, 'complete')} className="bg-purple-500 text-white px-2 py-1 rounded text-xs hover:bg-purple-600">Hoàn tất</button>
                    )}
                    {order.status !== 'CANCELLED' && order.status !== 'COMPLETED' && (
                      <button onClick={() => updateStatus(order.order_id, 'cancel')} className="border border-red-500 text-red-500 px-2 py-1 rounded text-xs hover:bg-red-50">Hủy đơn</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManagement;