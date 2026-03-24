// src/pages/Admin/ProductManagement.jsx
import React, { useState } from 'react';

const ProductManagement = () => {
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Giao diện Form Thêm Sản Phẩm (Hình 3)
  if (isAddingNew) {
    return (
      <div className="max-w-4xl bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-xl font-bold mb-6">Add New Product</h2>
        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Product SKU</label>
              <input type="text" placeholder="e.g. CPU-INT-12900K" className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Product Name</label>
              <input type="text" placeholder="e.g. Intel Core i9-12900K" className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Brand</label>
              <select className="w-full p-3 border border-gray-200 rounded-lg bg-white"><option>Select Brand</option></select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
              <select className="w-full p-3 border border-gray-200 rounded-lg bg-white"><option>Select Category</option></select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Price</label>
              <input type="text" placeholder="$" className="w-full p-3 border border-gray-200 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Quantity</label>
              <input type="number" placeholder="0" className="w-full p-3 border border-gray-200 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Warranty</label>
              <input type="text" placeholder="e.g. 12 months" className="w-full p-3 border border-gray-200 rounded-lg" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
            <textarea rows="4" placeholder="Enter detailed product specifications..." className="w-full p-3 border border-gray-200 rounded-lg"></textarea>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={() => setIsAddingNew(false)} className="px-6 py-2.5 font-bold text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" className="px-6 py-2.5 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700">Save Product</button>
          </div>
        </form>
      </div>
    );
  }

  // Giao diện Danh sách Sản phẩm (Hình 2)
  return (
    <div className="space-y-6">
      <div className="flex justify-end mb-4">
        <button onClick={() => setIsAddingNew(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700">+ Add New Product</button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-gray-500 font-medium text-sm">Total Products</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">1,248</p>
          <p className="text-green-500 text-sm font-bold mt-2">↗ +12% from last month</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-gray-500 font-medium text-sm">Out of Stock</p>
          <p className="text-3xl font-bold text-red-600 mt-2">14</p>
          <p className="text-gray-400 text-sm mt-2">Requires immediate attention</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-gray-500 font-medium text-sm">Inventory Value</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">$245,600.00</p>
          <p className="text-green-500 text-sm font-bold mt-2">↗ +5.4% growth</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {/* Row 1 */}
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">💻</div>
                  <div>
                    <p className="font-bold text-gray-900">RTX 4090 GPU</p>
                    <p className="text-xs text-gray-500">SKU: NV-4090-FE</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4"><span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">COMPONENTS</span></td>
              <td className="px-6 py-4 font-bold">$1,599.99</td>
              <td className="px-6 py-4 text-gray-600">12 units</td>
              <td className="px-6 py-4"><span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">● In Stock</span></td>
              <td className="px-6 py-4 flex justify-center gap-2">
                <button className="text-gray-400 hover:text-blue-600">✏️</button>
                <button className="text-gray-400 hover:text-red-600">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductManagement;