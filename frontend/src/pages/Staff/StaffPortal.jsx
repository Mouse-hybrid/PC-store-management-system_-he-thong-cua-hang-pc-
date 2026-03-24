// src/pages/Staff/StaffPortal.jsx
import React from 'react';

// --- Mock Data ---
const statsData = [
  { title: 'Today Orders', value: '42', change: '+12%', isPositive: true, compare: 'from yesterday', icon: '🧾' },
  { title: 'Pending Orders', value: '12', change: '-5%', isPositive: false, compare: 'from average', icon: '⏳' },
  { title: 'Low Stock Items', value: '8', change: '+2', isPositive: true, compare: 'new alerts today', icon: '📦' },
  { title: "Today's Revenue", value: '$4,250', change: '-3%', isPositive: false, compare: 'vs last Monday', icon: '💵' },
];

const recentOrders = [
  { id: '#ORD-7721', customer: 'John Doe', amount: '$1,200.00', status: 'Processing' },
  { id: '#ORD-7720', customer: 'Jane Smith', amount: '$850.00', status: 'Shipped' },
  { id: '#ORD-7719', customer: 'Robert Brown', amount: '$2,100.00', status: 'Pending' },
  { id: '#ORD-7718', customer: 'Emily Davis', amount: '$450.00', status: 'Completed' },
];

const lowStockItems = [
  { name: 'NVIDIA RTX 4080...', category: 'Graphics Cards', left: 2 },
  { name: 'Intel Core i9-14900K', category: 'Processors', left: 1 },
  { name: 'Samsung 990 Pro...', category: 'Storage', left: 4 },
  { name: 'Corsair RM850x...', category: 'Power Supplies', left: 0 },
];

const StaffPortal = () => {
  // Hàm phụ trợ để render màu sắc của Status Badge (Nhãn trạng thái)
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Processing': return 'bg-blue-100 text-blue-700';
      case 'Shipped': return 'bg-purple-100 text-purple-700';
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      case 'Completed': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      
      {/* --- Header (Thanh tìm kiếm) --- */}
      <div className="flex justify-between items-center mb-8">
        <div className="relative w-1/2">
          <input 
            type="text" 
            placeholder="Search orders, items..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {/* Icon Search */}
          <svg className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
      </div>

      {/* --- Stats Cards (4 khối thống kê ngang) --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat, index) => (
          <div key={index} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
              <span className="text-xl bg-gray-50 p-2 rounded-lg">{stat.icon}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</p>
            <div className="flex items-center text-xs">
              <span className={`font-bold mr-1 ${stat.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {stat.change}
              </span>
              <span className="text-gray-400">{stat.compare}</span>
            </div>
          </div>
        ))}
      </div>

      {/* --- Main Content: Bảng Orders và Cảnh báo Kho --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Cột Trái: Recent Orders (Chiếm 2/3) */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
            <button className="text-blue-600 text-sm font-semibold hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-gray-400 text-xs uppercase border-b border-gray-100">
                  <th className="pb-3 font-semibold">Order ID</th>
                  <th className="pb-3 font-semibold">Customer</th>
                  <th className="pb-3 font-semibold">Amount</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, index) => (
                  <tr key={index} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-4 text-sm font-semibold text-gray-900">{order.id}</td>
                    <td className="py-4 text-sm text-gray-600">{order.customer}</td>
                    <td className="py-4 text-sm font-semibold text-gray-900">{order.amount}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 text-center">
                      <button className="text-gray-400 hover:text-blue-600">
                        {/* Icon con mắt */}
                        <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cột Phải: Low Stock Alerts (Chiếm 1/3) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900">Low Stock Alerts</h2>
            <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full">8 URGENT</span>
          </div>
          <div className="flex-1 space-y-4">
            {lowStockItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                    {/* Icon giữ chỗ */}
                    📦
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">{item.name}</h4>
                    <p className="text-xs text-gray-500">{item.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-red-600">{item.left} left</p>
                  <button className="text-xs font-bold text-blue-600 hover:underline">RESTOCK</button>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 border border-gray-200 text-gray-600 text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors">
            View Full Inventory Report
          </button>
        </div>

      </div>
    </div>
  );
};

export default StaffPortal;