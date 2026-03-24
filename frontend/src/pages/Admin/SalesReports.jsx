// src/pages/Admin/SalesReports.jsx
import React from 'react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, Tooltip, ResponsiveContainer 
} from 'recharts';

const SalesReports = () => {
  const revenueData = [
    { month: 'JAN', value: 30 }, { month: 'FEB', value: 65 }, { month: 'MAR', value: 40 },
    { month: 'APR', value: 80 }, { month: 'MAY', value: 20 }, { month: 'JUN', value: 10 }
  ];

  const categorySales = [
    { name: 'GPU', value: 80 }, { name: 'CPU', value: 60 }, { name: 'RAM', value: 90 },
    { name: 'SSD', value: 70 }, { name: 'MB', value: 40 }, { name: 'PSU', value: 50 }
  ];

  return (
    <div className="space-y-6">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between"><p className="text-gray-500 font-medium">Total Revenue</p><span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded">↗ 12.5%</span></div>
          <p className="text-3xl font-bold text-gray-900 mt-2">$128,430.00</p>
          <p className="text-xs text-gray-400 mt-1">vs. $114,160 last month</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between"><p className="text-gray-500 font-medium">Units Sold</p><span className="text-xs font-bold text-red-700 bg-red-100 px-2 py-1 rounded">↘ 2.4%</span></div>
          <p className="text-3xl font-bold text-gray-900 mt-2">1,240</p>
          <p className="text-xs text-gray-400 mt-1">vs. 1,271 last month</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between"><p className="text-gray-500 font-medium">Avg. Order Value</p><span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded">↗ 5.1%</span></div>
          <p className="text-3xl font-bold text-gray-900 mt-2">$103.50</p>
          <p className="text-xs text-gray-400 mt-1">vs. $98.45 last month</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Line Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Revenue Analytics</h2>
              <p className="text-xs text-gray-500">Performance for the last 6 months</p>
            </div>
            <span className="text-xs font-bold bg-gray-100 px-3 py-1 rounded-lg">Last 6 Months</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                <Tooltip />
                {/* type="monotone" giúp đường cong mượt mà, strokeWidth làm đường biểu đồ đậm lên */}
                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={4} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Category Sales</h2>
              <p className="text-xs text-gray-500">Units sold by component type</p>
            </div>
            <span className="text-xs font-bold text-blue-600 uppercase">Current Month</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categorySales} barSize={40}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                <Tooltip cursor={{fill: 'transparent'}} />
                {/* radius bo tròn 2 góc trên của cột */}
                <Bar dataKey="value" fill="#bfdbfe" radius={[4, 4, 0, 0]} activeBar={{ fill: '#3b82f6' }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* (Bảng Best Selling Products ở dưới có cấu trúc HTML table tương tự các trang trên nên mình xin rút gọn để tập trung vào Charts) */}
    </div>
  );
};

export default SalesReports;