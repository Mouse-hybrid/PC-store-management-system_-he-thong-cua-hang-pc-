// src/pages/Admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import axiosClient from '../../api/axiosClient';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [revenueChartData, setRevenueChartData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  // Dữ liệu giả cho Category (Vì backend hiện tại chưa có API thống kê danh mục)
  const categoryData = [
    { name: 'Laptops', value: 45, color: '#3b82f6' },
    { name: 'GPU', value: 25, color: '#10b981' },
    { name: 'CPUs', value: 20, color: '#8b5cf6' },
    { name: 'Other', value: 10, color: '#f59e0b' },
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // 1. Gọi đồng thời các API thống kê
        const [financeRes, orderStatsRes, revenueRes, transactionsRes] = await Promise.all([
          axiosClient.get('/reports/finance-overview'),
          axiosClient.get('/reports/order-stats'),
          axiosClient.get('/reports/revenue'),
          axiosClient.get('/reports/recent-transactions')
        ]);

        // 2. Xử lý dữ liệu Tổng quan (Finance & Order Stats)
        const finance = financeRes.data;
        const totalOrders = orderStatsRes.data?.totalOrders || 0;

        setStats([
          { title: 'Total Revenue', value: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(finance.totalRevenue), change: '+12.5%', isPositive: true, icon: '💵' },
          { title: 'Total Orders', value: totalOrders.toLocaleString(), change: '+5.2%', isPositive: true, icon: '🛒' },
          { title: 'Pending Amount', value: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(finance.totalPending), change: 'Wait', isPositive: true, icon: '⏳' },
          { title: 'Refunded', value: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(finance.totalRefunds), change: '-2.1%', isPositive: false, icon: '🔙' },
        ]);

        // 3. XỬ LÝ BIỂU ĐỒ DOANH THU: Lọc COMPLETED và gom nhóm theo ngày
        // Lấy danh sách giao dịch từ API (sử dụng transactionsRes hoặc gọi thêm API lấy toàn bộ order)
        const allTransactions = transactionsRes.data || [];
        
        // Chỉ lấy những đơn hàng đã giao thành công
        const completedOrders = allTransactions.filter(order => order.status === 'COMPLETED');

        const dailyRevenue = {};
        completedOrders.forEach(order => {
          // Chuyển đổi ngày thành định dạng (VD: 24/03)
          const dateStr = new Date(order.created_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
          
          if (!dailyRevenue[dateStr]) {
            dailyRevenue[dateStr] = 0;
          }
          // Cộng dồn tiền của các đơn trong cùng 1 ngày
          dailyRevenue[dateStr] += Number(order.final_amount || order.total_price || 0);
        });

        // Chuyển đổi Object thành Mảng chuẩn của Recharts
        const chartMapped = Object.keys(dailyRevenue).map(date => ({
          name: date,
          value: dailyRevenue[date]
        }));
        
        // Sắp xếp lại theo ngày (tùy chọn)
        chartMapped.sort((a, b) => a.name.localeCompare(b.name));

        setRevenueChartData(chartMapped);

        // 4. Xử lý danh sách Đơn hàng gần nhất
        setRecentOrders(transactionsRes.data || []);

      } catch (error) {
        console.error("Lỗi khi tải dữ liệu Dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-700';
      case 'PENDING': return 'bg-yellow-100 text-yellow-700';
      case 'SHIPPED': return 'bg-blue-100 text-blue-700';
      case 'CANCELLED': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) return <div className="p-8 text-center font-bold text-blue-600">Đang tải dữ liệu thực tế...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      {/* --- Stats Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <span className="text-2xl">{stat.icon}</span>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.title}</h3>
            <p className="text-xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Trends */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Revenue Trends (Daily)</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Pie Chart (Tạm thời dùng data mẫu) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Market Share</h2>
          <div className="h-48 w-full relative flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
                  {categoryData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-y-2 mt-4">
            {categoryData.map((item, index) => (
              <div key={index} className="flex items-center text-xs text-gray-600 font-medium">
                <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: item.color }}></span>
                {item.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- Recent Orders Table (DỮ LIỆU THẬT) --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Recent Transactions</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-400 text-xs uppercase border-b border-gray-100">
                <th className="pb-3">Order ID</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.order_id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-4 text-sm font-semibold text-gray-900">#{order.order_id}</td>
                  <td className="py-4 text-sm font-semibold text-gray-700">{order.guest_name}</td>
                  <td className="py-4 text-sm font-bold text-gray-900">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.final_amount)}
                  </td>
                  <td className="py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${getStatusBadge(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString('vi-VN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {recentOrders.length === 0 && <p className="text-center py-4 text-gray-500">Chưa có giao dịch nào.</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;