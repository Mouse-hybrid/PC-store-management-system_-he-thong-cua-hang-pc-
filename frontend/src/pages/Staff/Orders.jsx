// src/pages/Staff/Orders.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom'; // QUAN TRỌNG ĐỂ ĐỌC URL
import { Plus, MoreHorizontal, X, Box, MapPin, Phone, RefreshCw } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

const tabs = ['Tất cả', 'PENDING', 'SHIPPED', 'COMPLETED', 'CANCELLED'];

export default function Orders() {
  const [searchParams] = useSearchParams();
  const searchKeyword = searchParams.get('search') || ''; // Đọc từ khóa từ thanh địa chỉ

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Tất cả');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/orders');
      setOrders(res.data?.data || res.data || []);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  // --- LOGIC LỌC DỮ LIỆU ĐÃ ĐƯỢC NÂNG CẤP ---
  const filteredOrders = orders.filter(order => {
    const matchesTab = activeTab === 'Tất cả' || order.status === activeTab;
    
    // Lọc theo từ khóa Search (Mã đơn hoặc Tên khách)
    const matchesSearch = !searchKeyword || 
      order.order_id.toString().includes(searchKeyword.replace('#', '')) ||
      (order.guest_name || '').toLowerCase().includes(searchKeyword.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <div className="flex h-full gap-6 relative overflow-hidden">
      <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div className="flex gap-6">
            {tabs.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-4 text-sm font-semibold relative ${activeTab === tab ? 'text-blue-600' : 'text-gray-500'}`}>
                {tab}
                {activeTab === tab && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></span>}
              </button>
            ))}
          </div>
          <button onClick={fetchOrders} className="p-2 border rounded-lg"><RefreshCw className="w-4 h-4 text-gray-400" /></button>
        </div>

        <div className="overflow-x-auto flex-1">
          {searchKeyword && <p className="px-6 py-2 bg-blue-50 text-blue-700 text-xs font-bold">🔍 Đang lọc theo từ khóa: "{searchKeyword}"</p>}
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 uppercase text-[10px] font-bold">
                <th className="p-4 pl-6">Mã đơn</th><th className="p-4">Khách hàng</th><th className="p-4">Tổng tiền</th><th className="p-4">Trạng thái</th><th className="p-4 pr-6 text-center">Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.order_id} onClick={() => setSelectedOrder(order)} className={`hover:bg-gray-50 cursor-pointer ${selectedOrder?.order_id === order.order_id ? 'bg-blue-50/50' : ''}`}>
                  <td className="p-4 pl-6 font-bold text-blue-600">#{order.order_id}</td>
                  <td className="p-4 font-semibold">{order.guest_name}</td>
                  <td className="p-4 font-bold">{new Intl.NumberFormat('vi-VN').format(order.final_amount)} ₫</td>
                  <td className="p-4"><span className="px-2 py-1 bg-gray-100 rounded text-[10px] font-bold">{order.status}</span></td>
                  <td className="p-4 text-center"><MoreHorizontal className="w-4 h-4 text-gray-300 mx-auto" /></td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredOrders.length === 0 && <div className="p-10 text-center text-gray-400">Không tìm thấy đơn hàng nào phù hợp.</div>}
        </div>
      </div>

      {/* Slide Panel bên phải giữ nguyên như cũ */}
      {selectedOrder && (
         <div className="w-80 bg-white border rounded-2xl p-6 shadow-lg animate-in slide-in-from-right">
            <div className="flex justify-between mb-6">
               <h2 className="font-bold text-lg">Chi tiết #{selectedOrder.order_id}</h2>
               <button onClick={() => setSelectedOrder(null)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="space-y-4">
               <div><p className="text-xs text-gray-400 font-bold uppercase">Khách hàng</p><p className="font-bold">{selectedOrder.guest_name}</p></div>
               <div><p className="text-xs text-gray-400 font-bold uppercase">Địa chỉ</p><p className="text-sm">{selectedOrder.shipping_address}</p></div>
            </div>
         </div>
      )}
    </div>
  );
}