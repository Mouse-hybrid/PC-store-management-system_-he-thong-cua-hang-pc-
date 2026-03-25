// src/pages/Admin/ProductManagement.jsx
import React, { useState } from 'react';

const ProductManagement = () => {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // 1. Thêm data mẫu có đầy đủ Brand và Description
  const [products, setProducts] = useState([
    {
      id: 1,
      sku: 'NV-4090-FE',
      name: 'RTX 4090 GPU',
      brand: 'nvidia',
      category: 'COMPONENTS',
      price: '1599.99',
      stock: '12',
      status: 'In Stock',
      icon: '💻',
      warranty: '36 Months',
      description: 'Card đồ họa NVIDIA GeForce RTX 4090 Founders Edition siêu mạnh mẽ'
    }
  ]);

  const [formData, setFormData] = useState({
    sku: '', name: '', brand: '', category: '', price: '', quantity: '', warranty: '', description: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
      setProducts(products.filter(product => product.id !== id));
    }
  };

  const handleEditClick = (product) => {
    // 2. VÁ LỖI: Đổ đầy đủ Brand, Warranty, Description cũ vào form khi bấm nút Sửa
    setFormData({
      sku: product.sku,
      name: product.name,
      category: product.category,
      price: product.price,
      quantity: product.stock,
      brand: product.brand || '', 
      warranty: product.warranty || '', 
      description: product.description || '' 
    });
    setEditingId(product.id);
    setIsAddingNew(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price) {
      alert("Vui lòng nhập Tên sản phẩm và Giá!");
      return;
    }

    // 3. VÁ LỖI: Gom đủ Brand, Warranty, Description vào cục data để lưu
    const productData = {
      sku: formData.sku || `SKU-${Math.floor(Math.random() * 1000)}`,
      name: formData.name,
      brand: formData.brand,           // <-- Đã lấy dữ liệu
      category: formData.category || 'OTHER',
      price: formData.price,
      stock: formData.quantity || '0',
      warranty: formData.warranty,     // <-- Đã lấy dữ liệu
      description: formData.description, // <-- Đã lấy dữ liệu
      status: Number(formData.quantity) > 0 ? 'In Stock' : 'Out of Stock',
      icon: '📦'
    };

    if (editingId) {
      setProducts(products.map(p => p.id === editingId ? { ...p, ...productData, id: editingId } : p));
    } else {
      setProducts([{ ...productData, id: Date.now() }, ...products]);
    }
    closeForm();
  };

  const closeForm = () => {
    setIsAddingNew(false);
    setEditingId(null);
    setFormData({ sku: '', name: '', brand: '', category: '', price: '', quantity: '', warranty: '', description: '' });
  };

  // --- GIAO DIỆN FORM (GIỮ NGUYÊN) ---
  if (isAddingNew) {
    return (
      <div className="max-w-4xl bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-xl font-bold mb-6">{editingId ? "Edit Product" : "Add New Product"}</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Product SKU</label>
              <input type="text" name="sku" value={formData.sku} onChange={handleInputChange} placeholder="e.g. CPU-INT-12900K" className="w-full p-3 border border-gray-200 rounded-lg outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Product Name <span className="text-red-500">*</span></label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. Intel Core i9-12900K" className="w-full p-3 border border-gray-200 rounded-lg outline-none" required />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Brand</label>
              <select name="brand" value={formData.brand} onChange={handleInputChange} className="w-full p-3 border border-gray-200 rounded-lg bg-white">
                <option value="">Select Brand</option>
                <option value="intel">Intel</option>
                <option value="amd">AMD</option>
                <option value="nvidia">Nvidia</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
              <select name="category" value={formData.category} onChange={handleInputChange} className="w-full p-3 border border-gray-200 rounded-lg bg-white">
                <option value="">Select Category</option>
                <option value="COMPONENTS">Components</option>
                <option value="PERIPHERALS">Peripherals</option>
                <option value="LAPTOPS">Laptops</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Price ($) <span className="text-red-500">*</span></label>
              <input type="number" name="price" value={formData.price} onChange={handleInputChange} placeholder="0.00" className="w-full p-3 border border-gray-200 rounded-lg" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Quantity</label>
              <input type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} placeholder="0" className="w-full p-3 border border-gray-200 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Warranty</label>
              <input type="text" name="warranty" value={formData.warranty} onChange={handleInputChange} placeholder="e.g. 12 months" className="w-full p-3 border border-gray-200 rounded-lg" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} rows="4" placeholder="Enter detailed product specifications..." className="w-full p-3 border border-gray-200 rounded-lg"></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={closeForm} className="px-6 py-2.5 font-bold text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" className="px-6 py-2.5 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700">{editingId ? "Update Product" : "Save Product"}</button>
          </div>
        </form>
      </div>
    );
  }

  // --- GIAO DIỆN DANH SÁCH SẢN PHẨM ---
  return (
    <div className="space-y-6">
      <div className="flex justify-end mb-4">
        <button onClick={() => { setIsAddingNew(true); setEditingId(null); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700">
          + Add New Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-gray-500 font-medium text-sm">Total Products</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{products.length + 1247}</p> 
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
            {products.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-xl mt-1">{item.icon}</div>
                    
                    {/* 4. CHỈNH SỬA GIAO DIỆN CỘT PRODUCT ĐỂ HIỆN BRAND VÀ DESCRIPTION */}
                    <div className="max-w-[250px]">
                      <p className="font-bold text-gray-900">{item.name}</p>
                      
                      {/* Khu vực chứa SKU và Tem Brand */}
                      <div className="flex gap-2 items-center mt-0.5">
                        <span className="text-xs text-gray-500">SKU: {item.sku}</span>
                        {item.brand && (
                          <span className="text-[10px] bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded font-bold uppercase">
                            {item.brand}
                          </span>
                        )}
                      </div>
                      
                      {/* Khu vực chứa Description (Giới hạn 1 dòng, hover để xem hết) */}
                      {item.description && (
                        <p className="text-xs text-gray-400 mt-1 truncate" title={item.description}>
                          {item.description}
                        </p>
                      )}
                    </div>
                    {/* KẾT THÚC VÙNG CHỈNH SỬA */}

                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    {item.category.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 font-bold">${item.price}</td>
                <td className="px-6 py-4 text-gray-600">{item.stock} units</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                    item.status === 'In Stock' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {item.status === 'In Stock' ? '● In Stock' : '● Out of Stock'}
                  </span>
                </td>
                <td className="px-6 py-4 flex justify-center gap-4">
                  <button onClick={() => handleEditClick(item)} className="text-gray-400 hover:text-blue-600 transition-colors" title="Edit">✏️</button>
                  <button onClick={() => handleDelete(item.id)} className="text-gray-400 hover:text-red-600 transition-colors" title="Delete">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {products.length === 0 && (
           <div className="p-8 text-center text-gray-500 font-medium">Chưa có sản phẩm nào. Hãy thêm mới!</div>
        )}
      </div>
    </div>
  );
};

export default ProductManagement;