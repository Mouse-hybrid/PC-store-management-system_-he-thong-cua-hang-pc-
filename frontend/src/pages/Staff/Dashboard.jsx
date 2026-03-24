import React from 'react';
import { 
  Receipt, ClipboardList, PackageX, Banknote, 
  Eye, Cpu, HardDrive, Zap, ChevronRight 
} from 'lucide-react';

// --- MOCK DATA ---
const statsData = [
  { title: 'Today Orders', value: '42', trend: '~12% from yesterday', trendUp: true, icon: Receipt, iconColor: 'text-blue-600', bgColor: 'bg-blue-50' },
  { title: 'Pending Orders', value: '12', trend: '~5% from average', trendUp: false, icon: ClipboardList, iconColor: 'text-orange-500', bgColor: 'bg-orange-50' },
  { title: 'Low Stock Items', value: '8', trend: '+2 new alerts today', trendUp: true, icon: PackageX, iconColor: 'text-red-500', bgColor: 'bg-red-50' },
  { title: 'Today\'s Revenue', value: '$4,250', trend: '~3% vs last Monday', trendUp: false, icon: Banknote, iconColor: 'text-emerald-600', bgColor: 'bg-emerald-50' },
];

const recentOrders = [
  { id: '#ORD-7721', customer: 'John Doe', amount: '$1,200.00', status: 'Processing' },
  { id: '#ORD-7720', customer: 'Jane Smith', amount: '$850.00', status: 'Shipped' },
  { id: '#ORD-7719', customer: 'Robert Brown', amount: '$2,100.00', status: 'Pending' },
  { id: '#ORD-7718', customer: 'Emily Davis', amount: '$450.00', status: 'Completed' },
];

const lowStockItems = [
  { name: 'NVIDIA RTX 4080 ...', category: 'Graphics Cards', left: 2, icon: Cpu },
  { name: 'Intel Core i9-14900K', category: 'Processors', left: 1, icon: Cpu },
  { name: 'Samsung 990 Pro ...', category: 'Storage', left: 4, icon: HardDrive },
  { name: 'Corsair RM850x P...', category: 'Power Supplies', left: 0, icon: Zap },
  { name: 'ASUS ROG Z790 H...', category: 'Motherboards', left: 3, icon: Cpu },
];

// --- HELPER FUNCTION ---
const getStatusColor = (status) => {
  switch (status) {
    case 'Processing': return 'bg-blue-100 text-blue-700';
    case 'Shipped': return 'bg-purple-100 text-purple-700';
    case 'Pending': return 'bg-yellow-100 text-yellow-700';
    case 'Completed': return 'bg-emerald-100 text-emerald-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* 1. Stat Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-sm font-semibold text-gray-500">{stat.title}</h3>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</h2>
            <p className={`text-xs font-medium ${stat.trendUp ? 'text-emerald-500' : 'text-red-500'}`}>
              {stat.trend}
            </p>
          </div>
        ))}
      </div>

      {/* 2. Main Content Grid (Table 2/3 width, Alerts 1/3 width) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Lõi bên trái: Recent Orders */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-800">Recent Orders</h3>
            <button className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
              View All
            </button>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50/50">
                  <th className="p-4 pl-6">ORDER ID</th>
                  <th className="p-4">CUSTOMER</th>
                  <th className="p-4">AMOUNT</th>
                  <th className="p-4">STATUS</th>
                  <th className="p-4 pr-6 text-center">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {recentOrders.map((order, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 pl-6 font-semibold text-gray-800">{order.id}</td>
                    <td className="p-4 text-gray-600">{order.customer}</td>
                    <td className="p-4 font-bold text-gray-800">{order.amount}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-center">
                      <button className="text-gray-400 hover:text-blue-600 transition-colors p-1">
                        <Eye className="w-5 h-5 inline-block" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cột bên phải: Low Stock Alerts */}
        <div className="xl:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-800">Low Stock Alerts</h3>
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
              8 Urgent
            </span>
          </div>
          <div className="p-2 flex-1 overflow-y-auto">
            {lowStockItems.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 group-hover:bg-white group-hover:shadow-sm transition-all">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 leading-tight">{item.name}</h4>
                    <p className="text-xs text-gray-400 mt-0.5">{item.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-red-500">{item.left} left</p>
                  <button className="text-[10px] font-bold text-blue-600 uppercase hover:underline mt-1">
                    RESTOCK
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-100">
            <button className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
              View Full Inventory Report
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}