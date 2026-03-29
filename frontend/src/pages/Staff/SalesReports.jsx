// src/pages/Staff/SalesReports.jsx
import React, { useState, useEffect } from 'react';
import { Banknote, ShoppingCart, Clock, Users, Calendar, ChevronDown, RefreshCw } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import axiosClient from '../../api/axiosClient';

export default function SalesReports() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      
      // 👉 SỬA LỖI Ở ĐÂY: Gọi API lấy đơn hàng thô thay vì gọi báo cáo doanh thu
      const [ordersRes, logRes] = await Promise.all([
        axiosClient.get('/orders'), // NẾU LỖI 404, bạn hãy đổi dòng này thành: axiosClient.get('/reports/recent-transactions')
        axiosClient.get('/reports/audit-logs?limit=15')
      ]);

      // Lấy danh sách đơn hàng thô
      const rawOrders = ordersRes.data?.data || ordersRes.data || [];

      // 1. Lọc chuẩn xác các đơn hàng COMPLETED
      const completedOrders = rawOrders.filter(item => item.status === 'COMPLETED');

      // 2. Gom nhóm cộng dồn tiền theo ngày
      const dailyRevenue = {};
      completedOrders.forEach(item => {
        // Lấy ngày đặt hàng (Format: DD-MM)
        const dateStr = new Date(item.created_at || item.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
        
        // Lấy số tiền
        const amount = Number(item.final_amount || item.total_price || item.total || item.total_revenue || 0);
        
        // Cộng dồn
        dailyRevenue[dateStr] = (dailyRevenue[dateStr] || 0) + amount;
      });

      // 3. Ép kiểu về mảng cho BarChart Recharts
      const formattedChartData = Object.keys(dailyRevenue).map(date => ({
        name: date,
        value: dailyRevenue[date]
      }));

      // Sắp xếp ngày từ cũ đến mới để biểu đồ đi từ trái qua phải
      formattedChartData.sort((a, b) => a.name.localeCompare(b.name));

      // Cập nhật State
      setRevenueData(formattedChartData);
      setAuditLogs(logRes.data?.data || logRes.data || []);
      
    } catch (error) {
      console.error("Lỗi tải báo cáo:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !reportData) return <div className="p-8 text-center font-bold text-blue-600">Đang tổng hợp dữ liệu doanh thu...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Detailed Sales Report</h1>
          <p className="text-sm text-gray-500">Số liệu thực tế được cập nhật từ hệ thống bán hàng.</p>
        </div>
        <button onClick={fetchReportData} className="p-2 bg-white border rounded-lg hover:bg-gray-50">
          <RefreshCw className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* --- STAT CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm font-semibold text-gray-500 mb-1 uppercase">Tổng doanh thu</p>
          <h2 className="text-2xl font-bold text-blue-600">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(reportData.stats.revenue)}
          </h2>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm font-semibold text-gray-500 mb-1 uppercase">Số đơn đã hoàn thành</p>
          <h2 className="text-2xl font-bold text-gray-800">{reportData.stats.sales} Đơn</h2>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm font-semibold text-gray-500 mb-1 uppercase">Giá trị TB đơn</p>
          <h2 className="text-2xl font-bold text-emerald-600">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(reportData.stats.avgOrder)}
          </h2>
        </div>
      </div>

      {/* --- REVENUE CHART --- */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-6">Biểu đồ tăng trưởng doanh thu (Từ Đơn Hoàn Thành)</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={reportData.chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
              <Tooltip 
                cursor={{fill: '#f9fafb'}}
                formatter={(val) => new Intl.NumberFormat('vi-VN').format(val) + ' ₫'}
              />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* --- RECENT SALES TABLE --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-bold text-gray-800">Giao dịch gần đây</h3>
        </div>
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50/50 font-semibold text-gray-400 uppercase">
              <th className="p-4 pl-6">Mã Đơn</th>
              <th className="p-4">Khách hàng</th>
              <th className="p-4">Ngày đặt</th>
              <th className="p-4">Trạng thái</th>
              <th className="p-4 pr-6 text-right">Thành tiền</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {reportData.recentSales.map((sale) => (
              <tr key={sale.order_id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 pl-6 font-bold text-blue-600">#{sale.order_id}</td>
                <td className="p-4 font-semibold text-gray-800">{sale.guest_name || 'Khách vãng lai'}</td>
                <td className="p-4 text-gray-500">{new Date(sale.created_at).toLocaleDateString('vi-VN')}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                    sale.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' : 
                    sale.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {sale.status}
                  </span>
                </td>
                <td className="p-4 pr-6 text-right font-bold text-gray-900">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(sale.final_amount || sale.total_price)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}