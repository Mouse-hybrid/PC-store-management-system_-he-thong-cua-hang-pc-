// src/pages/Admin/AdminDashboard.jsx
import React, { useState } from 'react';
import { 
  AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';

// --- Mock Data ---
const statsData = [
  { title: 'Total Revenue', value: '$128,430.00', change: '+12.5%', isPositive: true, icon: '💵' },
  { title: 'Total Orders', value: '1,240', change: '-2.1%', isPositive: false, icon: '🛒' },
  { title: 'Active Users', value: '45,210', change: '+5.3%', isPositive: true, icon: '👤' },
  { title: 'Conversion Rate', value: '3.42%', change: '+0.8%', isPositive: true, icon: '📈' },
];

const revenueData = [
  { name: 'MON', value: 4000 },
  { name: 'TUE', value: 3000 },
  { name: 'WED', value: 5000 },
  { name: 'THU', value: 2780 },
  { name: 'FRI', value: 1890 },
  { name: 'SAT', value: 6000 },
  { name: 'SUN', value: 5500 },
];

const categoryData = [
  { name: 'Laptops', value: 45, color: '#3b82f6' }, // Xanh dương
  { name: 'GPU', value: 25, color: '#10b981' },    // Xanh lá
  { name: 'CPUs', value: 20, color: '#8b5cf6' },   // Tím
  { name: 'Other', value: 10, color: '#f59e0b' },  // Cam
];

const recentOrders = [
  { id: '#ORD-2024-001', customer: 'John Doe', avatar: 'JD', product: 'RTX 4090 Graphics Card', amount: '$1,599.00', status: 'Delivered', date: 'Oct 24, 2023' },
  { id: '#ORD-2024-002', customer: 'Sarah Adams', avatar: 'SA', product: 'MacBook Pro M3 14"', amount: '$1,999.00', status: 'In Transit', date: 'Oct 23, 2023' },
];

const AdminDashboard = () => {
  const [timeRange, setTimeRange] = useState('Last 7 Days');

  // Hàm render màu cho badge status
  const getStatusBadge = (status) => {
    return status === 'Delivered' 
      ? 'bg-green-100 text-green-700' 
      : 'bg-blue-100 text-blue-700';
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      
      {/* --- Top Bar (Tìm kiếm & Actions) --- */}
      <div className="flex justify-between items-center mb-8">
        <div className="relative w-1/3">
          <input 
            type="text" 
            placeholder="Search orders, products..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-gray-500 hover:text-gray-700">🔔</button>
          <button className="text-gray-500 hover:text-gray-700">❓</button>
          <select className="border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 bg-white">
            <option>Quick Actions</option>
            <option>Add Product</option>
            <option>Create Report</option>
          </select>
        </div>
      </div>

      {/* --- Stats Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <span className="text-2xl">{stat.icon}</span>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.title}</h3>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* --- Charts Section --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Revenue Trends (Area Chart) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900">Revenue Trends</h2>
            <select 
              className="border border-gray-200 rounded-lg px-3 py-1 text-sm text-gray-600 bg-white"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  {/* Tạo dải màu gradient cho biểu đồ đẹp hơn */}
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                <Tooltip cursor={{ stroke: '#d1d5db', strokeWidth: 1, strokeDasharray: '3 3' }} />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Selling Categories (Donut Chart) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Top Selling Categories</h2>
          <div className="h-48 w-full relative flex-1">
            <ResponsiveContainer width="100%" height="100%">
              {/* innerRadius tạo ra khoảng trống ở giữa thành Donut */}
              <PieChart>
                <Pie data={categoryData} innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            {/* Chữ hiển thị giữa vòng tròn */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-gray-900">74%</span>
              <span className="text-xs text-gray-500">Market Share</span>
            </div>
          </div>
          
          {/* Custom Legend */}
          <div className="grid grid-cols-2 gap-y-2 mt-4">
            {categoryData.map((item, index) => (
              <div key={index} className="flex items-center text-xs text-gray-600 font-medium">
                <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: item.color }}></span>
                {item.name} ({item.value}%)
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- Recent Orders Table --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
          <button className="text-blue-600 text-sm font-semibold hover:underline">View All Orders</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-400 text-xs uppercase border-b border-gray-100">
                <th className="pb-3 font-semibold">Order ID</th>
                <th className="pb-3 font-semibold">Customer</th>
                <th className="pb-3 font-semibold">Product</th>
                <th className="pb-3 font-semibold">Amount</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order, index) => (
                <tr key={index} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-4 text-sm font-semibold text-gray-900">{order.id}</td>
                  <td className="py-4 text-sm">
                    <div className="flex items-center">
                      <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold mr-3">
                        {order.avatar}
                      </span>
                      <span className="font-semibold text-gray-900">{order.customer}</span>
                    </div>
                  </td>
                  <td className="py-4 text-sm text-gray-600">{order.product}</td>
                  <td className="py-4 text-sm font-bold text-gray-900">{order.amount}</td>
                  <td className="py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusBadge(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 text-sm text-gray-500">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;