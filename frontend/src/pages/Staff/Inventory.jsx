// src/pages/Staff/Inventory.jsx
import React, { useState, useEffect } from 'react';
import { Archive, AlertTriangle, XCircle, Banknote, Search, Filter, Download, PlusCircle, MinusCircle, Edit2, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

const tabs = ['All Items', 'Low Stock', 'Out of Stock'];

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
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/products');
      const data = res.data?.data || res.data || [];
      
      // Map thêm thuộc tính `status` ảo để frontend dễ lọc
      const mappedData = data.map(p => ({
        ...p,
        status: p.pro_quantity === 0 ? 'Out of Stock' : (p.pro_quantity <= 5 ? 'Low Stock' : 'In Stock')
      }));
      setProducts(mappedData);
    } catch (error) {
      console.error("Lỗi tải dữ liệu kho hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🛠 XỬ LÝ NHẬP KHO (RESTOCK)
  const handleRestock = async (productId, productName) => {
    const qtyStr = window.prompt(`Nhập số lượng muốn thêm vào kho cho: ${productName}`);
    if (qtyStr && !isNaN(qtyStr) && Number(qtyStr) > 0) {
      try {
        await axiosClient.post(`/products/${productId}/restock`, { quantity: Number(qtyStr) });
        alert('Nhập kho thành công!');
        fetchInventory(); // Tải lại để cập nhật số lượng mới
      } catch (error) {
        alert(error.response?.data?.message || 'Lỗi khi nhập kho');
      }
    } else if (qtyStr !== null) {
      alert('Vui lòng nhập một số hợp lệ lớn hơn 0!');
    }
  };

  // TÍNH TOÁN THỐNG KÊ REAL-TIME TỪ DỮ LIỆU
  const totalSkus = products.length;
  const lowStockCount = products.filter(p => p.status === 'Low Stock').length;
  const outOfStockCount = products.filter(p => p.status === 'Out of Stock').length;
  const stockValue = products.reduce((sum, p) => sum + (Number(p.pro_price) * Number(p.pro_quantity)), 0);

  const inventoryStats = [
    { title: 'Total SKUs', value: totalSkus, icon: Archive, iconColor: 'text-blue-500', bgColor: 'bg-blue-50' },
    { title: 'Low Stock Items', value: lowStockCount, icon: AlertTriangle, iconColor: 'text-orange-500', bgColor: 'bg-orange-50' },
    { title: 'Out of Stock', value: outOfStockCount, icon: XCircle, iconColor: 'text-red-500', bgColor: 'bg-red-50' },
    { title: 'Stock Value', value: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stockValue), icon: Banknote, iconColor: 'text-emerald-500', bgColor: 'bg-emerald-50' },
  ];

  const filteredProducts = products.filter(product => {
    if (activeTab === 'All Items') return true;
    return product.status === activeTab;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Inventory Management</h1>
        <p className="text-sm text-gray-500 mt-1">Monitor and manage your store's stock levels</p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {inventoryStats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-500 mb-1">{stat.title}</p>
            <h2 className="text-3xl font-bold text-gray-800">{stat.value}</h2>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex p-1 bg-gray-100 rounded-lg">
            {tabs.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${activeTab === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}>
                {tab}
              </button>
            ))}
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button onClick={fetchInventory} className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              <RefreshCw className="w-4 h-4" /> Làm mới
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" /> Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto min-h-[300px]">
          {loading ? (
             <div className="flex items-center justify-center h-full pt-10 text-blue-600 font-bold">Đang tải dữ liệu kho...</div>
          ) : (
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
                  <tr key={product.pro_id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 pl-6 flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Archive className="w-5 h-5 text-gray-400" />
                      </div>
                      <span className="font-semibold text-gray-800">{product.pro_name}</span>
                    </td>
                    <td className="p-4 text-gray-600">{product.cat_name || 'N/A'}</td>
                    <td className="p-4 text-gray-500 font-mono text-xs">{product.pro_sku}</td>
                    <td className="p-4 text-center">
                      <span className={`font-bold ${product.pro_quantity === 0 ? 'text-red-500' : product.pro_quantity <= 5 ? 'text-orange-500' : 'text-gray-800'}`}>
                        {product.pro_quantity}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-gray-800">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.pro_price)}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${getStatusBadge(product.status)}`}>{product.status}</span>
                    </td>
                    <td className="p-4 pr-6">
                      <div className="flex justify-center items-center gap-2">
                        {/* NÚT THÊM HÀNG */}
                        <button onClick={() => handleRestock(product.pro_id, product.pro_name)} className="text-blue-500 hover:bg-blue-50 p-1.5 rounded-md transition-colors flex items-center gap-1 font-bold text-xs" title="Nhập kho">
                          <PlusCircle className="w-4 h-4" /> Nhập kho
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!loading && filteredProducts.length === 0 && <div className="text-center p-8 text-gray-400">Không tìm thấy sản phẩm nào.</div>}
        </div>
      </div>
    </div>
  );
}