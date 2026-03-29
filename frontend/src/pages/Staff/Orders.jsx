// src/pages/Staff/Orders.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MoreHorizontal, X, RefreshCw } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

const tabs = ['Tất cả', 'PENDING', 'SHIPPED', 'COMPLETED', 'CANCELLED'];

export default function Orders() {
  const [searchParams] = useSearchParams();
  const searchKeyword = searchParams.get('search') || '';

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
    } catch (error) { 
      console.error(error); 
    } finally { 
      setLoading(false); 
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesTab = activeTab === 'Tất cả' || order.status === activeTab;
    const matchesSearch = !searchKeyword || 
      order.order_id.toString().includes(searchKeyword.replace('#', '')) ||
      (order.guest_name || '').toLowerCase().includes(searchKeyword.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // 👉 HÀM TẠO MÀU SẮC CHO TRẠNG THÁI THEO YÊU CẦU
  const getStatusStyle = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING': 
        return 'bg-yellow-100 text-yellow-700 border border-yellow-200'; // Vàng
      case 'SHIPPED': 
        return 'bg-blue-100 text-blue-700 border border-blue-200'; // Xanh dương
      case 'COMPLETED': 
        return 'bg-green-100 text-green-700 border border-green-200'; // Xanh lá
      case 'CANCELLED': 
        return 'bg-red-100 text-red-700 border border-red-200'; // Đỏ
      default: 
        return 'bg-gray-100 text-gray-700 border border-gray-200'; // Mặc định
    }
  };

  return (
    <div className="flex h-full gap-6 relative overflow-hidden font-sans">
      <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100">
        
        {/* Header Tabs */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div className="flex gap-6">
            {tabs.map(tab => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)} 
                className={`pb-4 text-sm font-semibold relative transition-colors ${activeTab === tab ? 'text-teal-600' : 'text-gray-500 hover:text-gray-800'}`}
              >
                {tab}
                {activeTab === tab && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-600 rounded-t-full"></span>}
              </button>
            ))}
          </div>
          <button onClick={fetchOrders} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <RefreshCw className={`w-4 h-4 text-gray-500 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto flex-1">
          {searchKeyword && (
            <p className="px-6 py-3 bg-teal-50 text-teal-700 text-xs font-bold border-b border-teal-100">
              🔍 Đang lọc theo từ khóa: "{searchKeyword}"
            </p>
          )}
          
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 uppercase text-[10px] font-bold tracking-wider">
                <th className="p-4 pl-6">Mã đơn</th>
                <th className="p-4">Khách hàng</th>
                <th className="p-4">Tổng tiền</th>
                <th className="p-4">Trạng thái</th>
                <th className="p-4 pr-6 text-center">Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr 
                  key={order.order_id} 
                  onClick={() => setSelectedOrder(order)} 
                  className={`hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0 ${selectedOrder?.order_id === order.order_id ? 'bg-teal-50/40' : ''}`}
                >
                  <td className="p-4 pl-6 font-bold text-teal-600">#{order.order_id}</td>
                  <td className="p-4 font-semibold text-gray-800">{order.guest_name}</td>
                  <td className="p-4 font-bold text-gray-900">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.final_amount)}
                  </td>
                  <td className="p-4">
                    {/* 👉 GẮN MÀU VÀO ĐÂY */}
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider ${getStatusStyle(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <MoreHorizontal className="w-4 h-4 text-gray-400 mx-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredOrders.length === 0 && !loading && (
            <div className="p-10 text-center text-gray-400 italic">
              Không tìm thấy đơn hàng nào phù hợp.
            </div>
          )}
        </div>
      </div>

      {/* Slide Panel bên phải (Chi tiết) */}
      {selectedOrder && (
         <div className="w-80 bg-white border border-gray-100 rounded-2xl p-6 shadow-xl animate-in slide-in-from-right flex flex-col">
            <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
               <h2 className="font-bold text-lg text-gray-900">Chi tiết #{selectedOrder.order_id}</h2>
               <button onClick={() => setSelectedOrder(null)} className="hover:bg-gray-100 p-1.5 rounded-lg transition-colors">
                 <X className="w-5 h-5 text-gray-400" />
               </button>
            </div>
            
            <div className="space-y-6 flex-1">
               <div>
                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1.5">Khách hàng</p>
                 <p className="font-bold text-gray-900">{selectedOrder.guest_name}</p>
               </div>
               
               <div>
                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1.5">Địa chỉ giao hàng</p>
                 <p className="text-sm text-gray-700 leading-relaxed">{selectedOrder.shipping_address || 'Nhận tại cửa hàng'}</p>
               </div>
               
               <div>
                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">Trạng thái hiện tại</p>
                 {/* 👉 GẮN MÀU VÀO PANEL CHI TIẾT LUÔN */}
                 <span className={`px-3 py-1.5 rounded-md text-[11px] font-bold tracking-wider inline-block shadow-sm ${getStatusStyle(selectedOrder.status)}`}>
                    {selectedOrder.status}
                 </span>
               </div>
            </div>
         </div>
      )}
    </div>
  );
}