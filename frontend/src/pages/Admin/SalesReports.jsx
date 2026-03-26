// src/pages/Admin/SalesReports.jsx
import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const SalesReports = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const [revRes, logRes] = await Promise.all([
        axiosClient.get('/reports/revenue'),
        axiosClient.get('/reports/audit-logs?limit=15')
      ]);

      // Xử lý dữ liệu biểu đồ
      const rawRevenue = revRes.data?.data || revRes.data || [];
      const formattedChartData = rawRevenue.map(item => ({
        name: new Date(item.date || item.created_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
        value: Number(item.total || item.total_revenue || 0)
      }));

      setRevenueData(formattedChartData);
      setAuditLogs(logRes.data?.data || logRes.data || []);
    } catch (error) {
      console.error("Lỗi tải báo cáo:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center font-bold text-blue-600">Đang tổng hợp báo cáo...</div>;

  return (
    <div className="p-8 font-sans">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Báo cáo & Thống kê</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* KHUNG BIỂU ĐỒ DOANH THU (2 Cột) */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Biểu đồ Doanh thu (Theo Ngày)</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
                <Tooltip 
                  formatter={(value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)}
                  cursor={{fill: '#f3f4f6'}}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {revenueData.length === 0 && <p className="text-center text-sm text-gray-400 mt-4">Chưa có dữ liệu giao dịch.</p>}
        </div>

        {/* KHUNG NHẬT KÝ HỆ THỐNG (1 Cột) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col h-96">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Nhật ký Hệ thống (Audit Logs)</h2>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {auditLogs.map((log, index) => (
              <div key={index} className="pb-3 border-b border-gray-100 last:border-0">
                <p className="text-xs text-gray-400 mb-1">{new Date(log.created_at).toLocaleString('vi-VN')}</p>
                <p className="text-sm font-medium text-gray-800">{log.action || log.description}</p>
                <p className="text-[10px] text-blue-600 font-bold mt-1">Bởi: {log.user_name || log.username || 'System'}</p>
              </div>
            ))}
            {auditLogs.length === 0 && <p className="text-sm text-gray-400 text-center mt-10">Không có nhật ký nào.</p>}
          </div>
        </div>

      </div>
    </div>
  );
};

export default SalesReports;