import React, { useState } from 'react';
import { 
  Archive, AlertTriangle, XCircle, Banknote, 
  Search, Filter, Download, PlusCircle, MinusCircle, Edit2, ChevronLeft, ChevronRight 
} from 'lucide-react';

// --- MOCK DATA ---
const inventoryStats = [
  { title: 'Total SKUs', value: '1,284', trend: '+2.4%', trendType: 'positive', icon: Archive, iconColor: 'text-blue-500', bgColor: 'bg-blue-50' },
  { title: 'Low Stock Items', value: '12', trend: '+3', trendType: 'negative', icon: AlertTriangle, iconColor: 'text-orange-500', bgColor: 'bg-orange-50' },
  { title: 'Out of Stock', value: '5', trend: 'Stable', trendType: 'neutral', icon: XCircle, iconColor: 'text-red-500', bgColor: 'bg-red-50' },
  { title: 'Stock Value', value: '$245,800', trend: '', trendType: '', icon: Banknote, iconColor: 'text-emerald-500', bgColor: 'bg-emerald-50' },
];

const mockProducts = [
  { id: 1, name: 'AMD Ryzen 9 7950X', category: 'Processors', sku: 'CPU-AMD-7950X', stock: 24, price: '$699.00', status: 'In Stock' },
  { id: 2, name: 'NVIDIA RTX 4080 Super', category: 'Graphics Cards', sku: 'GPU-NV-4080S', stock: 3, price: '$1,099.00', status: 'Low Stock' },
  { id: 3, name: 'Corsair Vengeance 32GB DDR5', category: 'Memory (RAM)', sku: 'RAM-COR-32D5', stock: 0, price: '$125.00', status: 'Out of Stock' },
  { id: 4, name: 'Samsung 980 Pro 2TB NVMe', category: 'Storage', sku: 'SSD-SAM-980-2', stock: 12, price: '$189.99', status: 'In Stock' },
  { id: 5, name: 'NZXT H510 Flow White', category: 'Cases', sku: 'CAS-NZXT-H510W', stock: 8, price: '$99.99', status: 'In Stock' },
];

const tabs = ['All Items', 'Low Stock', 'Out of Stock'];

// Helper function để tô màu Status Badge
const getStatusBadge = (status) => {
  switch (status) {
    case 'In Stock': return 'bg-emerald-100 text-emerald-700';
    case 'Low Stock': return 'bg-yellow-100 text-yellow-700';
    case 'Out of Stock': return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

export default function Inventory() {
  const [activeTab, setActiveTab] = useState('All Items');

  // Logic lọc dữ liệu dựa trên tab đang chọn
  const filteredProducts = mockProducts.filter(product => {
    if (activeTab === 'All Items') return true;
    return product.status === activeTab;
  });

  return (
    <div className="space-y-6">
      {/* 1. Header Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Inventory Management</h1>
        <p className="text-sm text-gray-500 mt-1">Monitor and manage your store's stock levels</p>
      </div>

      {/* 2. Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {inventoryStats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
              {stat.trend && (
                <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                  stat.trendType === 'positive' ? 'bg-emerald-100 text-emerald-700' : 
                  stat.trendType === 'negative' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {stat.trend}
                </span>
              )}
            </div>
            <p className="text-sm font-semibold text-gray-500 mb-1">{stat.title}</p>
            <h2 className="text-3xl font-bold text-gray-800">{stat.value}</h2>
          </div>
        ))}
      </div>

      {/* 3. Main Data Table Area */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        
        {/* Table Toolbar */}
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Tabs */}
          <div className="flex p-1 bg-gray-100 rounded-lg">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
                  activeTab === tab 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex gap-3 w-full md:w-auto">
            <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 cursor-pointer outline-none">
              <option>All Categories</option>
              <option>Processors</option>
              <option>Graphics Cards</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" /> Filters
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" /> Export
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50/50 border-b border-gray-100">
                <th className="p-4 pl-6">PRODUCT NAME</th>
                <th className="p-4">CATEGORY</th>
                <th className="p-4">SKU</th>
                <th className="p-4 text-center">STOCK LEVEL</th>
                <th className="p-4">PRICE</th>
                <th className="p-4">STATUS</th>
                <th className="p-4 pr-6 text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 pl-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Archive className="w-5 h-5 text-gray-400" />
                    </div>
                    <span className="font-semibold text-gray-800">{product.name}</span>
                  </td>
                  <td className="p-4 text-gray-600">{product.category}</td>
                  <td className="p-4 text-gray-500 font-mono text-xs">{product.sku}</td>
                  <td className="p-4 text-center">
                    <span className={`font-bold ${product.stock === 0 ? 'text-red-500' : product.stock <= 5 ? 'text-orange-500' : 'text-gray-800'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-gray-800">{product.price}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${getStatusBadge(product.status)}`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6">
                    <div className="flex justify-center items-center gap-2">
                      <button className="text-blue-500 hover:bg-blue-50 p-1.5 rounded-md transition-colors" title="Add Stock">
                        <PlusCircle className="w-4 h-4" />
                      </button>
                      <button className="text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-colors" title="Reduce Stock">
                        <MinusCircle className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-1.5 rounded-md transition-colors" title="Edit Product">
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500 bg-gray-50/30">
          <p>Showing 1 to {filteredProducts.length} of {activeTab === 'All Items' ? '1,284' : filteredProducts.length} results</p>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-gray-200 bg-white rounded-md hover:bg-gray-50 text-gray-400">Previous</button>
            <button className="px-3 py-1 border border-blue-600 bg-blue-600 text-white rounded-md font-medium">1</button>
            <button className="px-3 py-1 border border-gray-200 bg-white rounded-md hover:bg-gray-50">2</button>
            <button className="px-3 py-1 border border-gray-200 bg-white rounded-md hover:bg-gray-50">3</button>
            <button className="px-3 py-1 border border-gray-200 bg-white rounded-md hover:bg-gray-50 text-gray-700">Next</button>
          </div>
        </div>

      </div>
    </div>
  );
}