// src/pages/Staff/StaffPortal.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';

const StaffPortal = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [dashboardData, setDashboardData] = useState({ todayOrders: 0, pendingOrders: 0, todayRevenue: 0, lowStockCount: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);

  useEffect(() => {
    fetchPortalData();
  }, []);

  const fetchPortalData = async () => {
    try {
      setLoading(true);
      const [ordersRes, productsRes] = await Promise.all([ axiosClient.get('/orders'), axiosClient.get('/products') ]);
      const orders = ordersRes.data?.data || ordersRes.data || [];
      const products = productsRes.data?.data || productsRes.data || [];

      const todayStr = new Date().toLocaleDateString('vi-VN');
      let tOrders = 0, pOrders = 0, tRevenue = 0;

      orders.forEach(o => {
        if (o.status === 'PENDING') pOrders++;
        if (new Date(o.created_at).toLocaleDateString('vi-VN') === todayStr) {
          tOrders++;
          if (o.status !== 'CANCELLED') tRevenue += Number(o.final_amount || 0);
        }
      });

      const lowStock = products.filter(p => p.pro_quantity <= 5).sort((a, b) => a.pro_quantity - b.pro_quantity);
      setDashboardData({ todayOrders: tOrders, pendingOrders: pOrders, todayRevenue: tRevenue, lowStockCount: lowStock.length });
      setRecentOrders(orders);
      setLowStockItems(lowStock);
    } catch (error) { console.error("Lỗi tải data:", error); } finally { setLoading(false); }
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      // Nhảy sang trang Orders để tìm kiếm kết quả chi tiết
      navigate(`/staff/orders?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // --- LỌC DỮ LIỆU HIỂN THỊ TẠI CHỖ (LOCAL FILTER) ---
  const filteredOrders = recentOrders.filter(o => 
    o.order_id.toString().includes(searchQuery.replace('#', '')) ||
    (o.guest_name || '').toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5);

  const filteredStock = lowStockItems.filter(p => 
    p.pro_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.pro_sku.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5);

  if (loading) return <div className="p-8 text-center font-bold text-blue-600">Đang kết nối hệ thống...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <div className="flex justify-between items-center mb-8">
        <div className="relative w-1/2">
          <input 
            type="text" placeholder="Tìm kiếm nhanh mã đơn hoặc tên khách..." 
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyPress}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
          />
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
           <p className="text-gray-500 text-xs font-bold uppercase mb-1">Hôm nay</p>
           <p className="text-2xl font-bold text-gray-900">{dashboardData.todayOrders} đơn</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
           <p className="text-gray-500 text-xs font-bold uppercase mb-1">Doanh thu</p>
           <p className="text-xl font-bold text-emerald-600">{new Intl.NumberFormat('vi-VN').format(dashboardData.todayRevenue)} ₫</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
           <p className="text-gray-500 text-xs font-bold uppercase mb-1">Chờ xử lý</p>
           <p className="text-2xl font-bold text-yellow-600">{dashboardData.pendingOrders}</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
           <p className="text-gray-500 text-xs font-bold uppercase mb-1">Cảnh báo kho</p>
           <p className="text-2xl font-bold text-red-600">{dashboardData.lowStockCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold mb-4">{searchQuery ? `Kết quả đơn hàng cho "${searchQuery}"` : 'Đơn hàng gần đây'}</h2>
          <table className="w-full text-left">
            <thead className="text-xs text-gray-400 uppercase border-b">
              <tr><th className="pb-3">Mã đơn</th><th className="pb-3">Khách hàng</th><th className="pb-3">Tổng tiền</th></tr>
            </thead>
            <tbody>
              {filteredOrders.map(o => (
                <tr key={o.order_id} className="border-b last:border-0 hover:bg-gray-50 cursor-pointer" onClick={() => navigate('/staff/orders')}>
                  <td className="py-4 font-bold text-blue-600">#{o.order_id}</td>
                  <td className="py-4 text-sm text-gray-600">{o.guest_name}</td>
                  <td className="py-4 font-bold">{new Intl.NumberFormat('vi-VN').format(o.final_amount)} ₫</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
           <h2 className="text-lg font-bold mb-4">Kho hàng sắp hết</h2>
           <div className="space-y-4">
              {filteredStock.map(p => (
                <div key={p.pro_id} className="flex justify-between items-center p-3 bg-red-50/30 rounded-lg">
                   <div className="overflow-hidden"><p className="text-sm font-bold truncate">{p.pro_name}</p><p className="text-[10px] font-mono text-gray-400">{p.pro_sku}</p></div>
                   <p className="text-red-600 font-bold text-sm">Còn {p.pro_quantity}</p>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default StaffPortal;