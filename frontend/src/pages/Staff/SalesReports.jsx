import React, { useState, useEffect } from 'react';
import { Banknote, ShoppingCart, Clock, Users, Calendar, ChevronDown } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function SalesReports() {
  // 1. Khởi tạo State trống, sẵn sàng nhận dữ liệu từ API
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 2. Hàm giả lập gọi API (Trong thực tế bạn sẽ dùng fetch('/api/sales-report'))
  useEffect(() => {
    const getSalesDataFromAPI = async () => {
      try {
        setIsLoading(true);
        // Giả lập độ trễ mạng (Network Latency) 1 giây
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Giả lập cục JSON trả về từ Server Node.js của bạn
        const responseFromServer = {
          stats: {
            revenue: { value: '$124,592.00', trend: '+12.5%', isUp: true },
            sales: { value: '1,482', trend: '+5.2%', isUp: true },
            avgOrder: { value: '$84.07', trend: '-2.1%', isUp: false },
            customers: { value: '248', trend: '+8.4%', isUp: true },
          },
          chartData: [
            { day: 'Mon', value: 12000 }, { day: 'Tue', value: 15000 },
            { day: 'Wed', value: 11000 }, { day: 'Thu', value: 18000 },
            { day: 'Fri', value: 17000 }, { day: 'Sat', value: 25000 },
            { day: 'Sun', value: 28000 }
          ],
          categories: [
            { name: 'Electronics', percent: 42, color: 'bg-blue-600' },
            { name: 'Home Office', percent: 28, color: 'bg-blue-500' },
            { name: 'Software', percent: 18, color: 'bg-blue-400' },
            { name: 'Others', percent: 12, color: 'bg-blue-200' },
          ],
          recentSales: [
            { product: 'MacBook Pro M2', id: '#ORD-28491', customer: 'Alex Johnson', email: 'alex.j@example.com', date: 'Oct 24, 2023', status: 'Completed', amount: '$2,499.00' }
            // (Thực tế API sẽ trả về mảng dài hơn)
          ]
        };

        // 3. Đưa dữ liệu API vào State
        setReportData(responseFromServer);
      } catch (error) {
        console.error("Lỗi khi gọi API: ", error);
      } finally {
        setIsLoading(false); // Tắt loading
      }
    };

    getSalesDataFromAPI();
  }, []);

  // 4. Xử lý giao diện lúc đang chờ API (Loading State)
  if (isLoading || !reportData) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Đang tải dữ liệu từ máy chủ...</p>
        </div>
      </div>
    );
  }

  // 5. Giao diện chính thức sau khi API đã trả dữ liệu về
  return (
    <div className="space-y-6">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Detailed Sales Report</h1>
          <p className="text-sm text-gray-500 mt-1">Comprehensive view of revenue and performance metrics for the current period.</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer hover:bg-gray-50">
            <span className="text-gray-400 font-normal text-xs mr-1">CATEGORY</span>
            All Categories <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
          <div className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer hover:bg-gray-50">
            <span className="text-gray-400 font-normal text-xs mr-1">TIME RANGE</span>
            Last 30 Days <Calendar className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* --- STAT CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Revenue', icon: Banknote, data: reportData.stats.revenue, color: 'text-blue-600' },
          { title: 'Total Sales', icon: ShoppingCart, data: reportData.stats.sales, color: 'text-blue-500' },
          { title: 'Avg. Order Value', icon: Clock, data: reportData.stats.avgOrder, color: 'text-blue-400' },
          { title: 'New Customers', icon: Users, data: reportData.stats.customers, color: 'text-emerald-500' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 bg-gray-50 rounded-lg">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <span className={`text-xs font-bold ${stat.data.isUp ? 'text-emerald-500' : 'text-red-500'}`}>
                {stat.data.trend}
              </span>
            </div>
            <p className="text-sm font-semibold text-gray-500 mb-1">{stat.title}</p>
            <h2 className="text-2xl font-bold text-gray-800">{stat.data.value}</h2>
          </div>
        ))}
      </div>

      {/* --- MIDDLE SECTION: CHARTS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Biểu đồ cột (Recharts) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-800">Revenue Trends</h3>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button className="px-4 py-1.5 text-xs font-bold bg-blue-600 text-white rounded-md shadow-sm">Weekly</button>
              <button className="px-4 py-1.5 text-xs font-bold text-gray-500 hover:text-gray-800">Monthly</button>
            </div>
          </div>
          <div className="flex-1 min-h-[250px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reportData.chartData}>
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                  dy={10}
                />
                <Tooltip 
                  cursor={{ fill: '#f3f4f6' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {reportData.chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index >= 5 ? '#2563eb' : '#bfdbfe'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown (Thanh tiến trình) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-gray-800 mb-6">Category Breakdown</h3>
            <div className="space-y-5">
              {reportData.categories.map((cat, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm font-semibold mb-2">
                    <span className="text-gray-700">{cat.name}</span>
                    <span className="text-gray-500">{cat.percent}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${cat.color} rounded-full`} style={{ width: `${cat.percent}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 p-4 bg-gray-50 rounded-xl text-xs font-medium text-gray-500 text-center">
            Electronics revenue has grown by <span className="text-emerald-500 font-bold">18%</span> compared to previous week.
          </div>
        </div>
      </div>

      {/* --- BOTTOM SECTION: DATA TABLE --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-800">Sales Breakdown</h3>
          <button className="text-sm font-semibold text-blue-600 hover:text-blue-800">View All Sales</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="font-semibold text-gray-400 uppercase tracking-wider bg-gray-50/50">
                <th className="p-4 pl-6">PRODUCT</th>
                <th className="p-4">ORDER ID</th>
                <th className="p-4">CUSTOMER</th>
                <th className="p-4">DATE</th>
                <th className="p-4">STATUS</th>
                <th className="p-4 pr-6">AMOUNT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reportData.recentSales.map((sale, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 pl-6 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center">
                       <ShoppingCart className="w-4 h-4 text-gray-400" />
                    </div>
                    <span className="font-semibold text-gray-800">{sale.product}</span>
                  </td>
                  <td className="p-4 text-gray-500">{sale.id}</td>
                  <td className="p-4">
                    <p className="font-semibold text-gray-800">{sale.customer}</p>
                    <p className="text-xs text-gray-400">{sale.email}</p>
                  </td>
                  <td className="p-4 text-gray-600">{sale.date}</td>
                  <td className="p-4">
                    <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md text-[10px] font-bold uppercase">
                      {sale.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 font-bold text-gray-800">{sale.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}