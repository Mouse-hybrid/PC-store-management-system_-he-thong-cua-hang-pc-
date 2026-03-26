// src/pages/Admin/ProductManagement.jsx
import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';

const BACKEND_URL = 'https://localhost:3443'; // Thay bằng URL Backend của bạn

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [selectedImageFile, setSelectedImageFile] = useState(null);

  const [formData, setFormData] = useState({
    sku: '', name: '', brandId: '', catId: '', price: '', quantity: '', warranty: '', description: '',
    currentImageUrl: '' 
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes, brandRes] = await Promise.all([
        axiosClient.get('/products'),
        axiosClient.get('/products/catalog/categories'),
        axiosClient.get('/products/catalog/brands')
      ]);

      setProducts(prodRes.data || []);
      setCategories(catRes.data || []);
      setBrands(brandRes.data || []);
    } catch (error) {
      console.error("Lỗi tải dữ liệu sản phẩm:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditClick = (product) => {
    setFormData({
      sku: product.pro_sku || '',
      name: product.pro_name || '',
      price: product.pro_price || '',
      quantity: product.pro_quantity || '', 
      brandId: product.brand_id || '',
      catId: product.category_id || '', 
      warranty: product.pro_warranty || '', 
      description: product.description || '',
      // Lấy link ảnh từ DB
      currentImageUrl: product.image_url ? `${BACKEND_URL}${product.image_url}` : ''
    });
    setEditingId(product.pro_id);
    setIsAddingNew(true);
    setSelectedImageFile(null); // Reset file preview
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này khỏi kho?")) {
      try {
        await axiosClient.delete(`/products/${id}`);
        setProducts(products.filter(p => p.pro_id !== id));
        alert("Đã xóa sản phẩm thành công!");
      } catch (error) {
        alert(error.response?.data?.message || "Lỗi khi xóa sản phẩm");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let currentProductId = editingId;

      if (editingId) {
        await axiosClient.put(`/products/${editingId}`, {
          pro_name: formData.name, pro_sku: formData.sku, pro_price: formData.price,
          category_id: parseInt(formData.catId), brand_id: parseInt(formData.brandId),     
          pro_warranty: formData.warranty, description: formData.description
        });
      } else {
        const res = await axiosClient.post('/products/import', {
          sku: formData.sku, name: formData.name, price: formData.price, qty: formData.quantity,
          brandId: parseInt(formData.brandId), catId: parseInt(formData.catId), description: formData.description
        });
        currentProductId = res.data?.data?.insertId || res.data?.data?.pro_id || null;
      }

      // Xử lý Upload Ảnh
      if (selectedImageFile && currentProductId) {
        const imageFormData = new FormData();
        imageFormData.append('image', selectedImageFile); 

        await axiosClient.post(`/products/${currentProductId}/images`, imageFormData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      alert("Lưu sản phẩm thành công!");
      setIsAddingNew(false);
      setEditingId(null);
      setSelectedImageFile(null); 
      fetchInitialData(); 
    } catch (error) {
      alert(error.response?.data?.message || "Lỗi khi lưu dữ liệu hoặc upload ảnh");
    }
  };

  if (loading && products.length === 0) return <div className="p-8 text-center font-bold text-blue-600">Đang kết nối kho hàng...</div>;

  if (isAddingNew) {
    return (
      <div className="max-w-4xl bg-white rounded-xl shadow-sm border border-gray-200 p-8 mx-auto">
        <h2 className="text-xl font-bold mb-6 text-blue-600">{editingId ? "Chỉnh sửa sản phẩm" : "Nhập kho sản phẩm mới"}</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Mã SKU</label>
              <input type="text" name="sku" value={formData.sku} onChange={handleInputChange} className="w-full p-3 border border-gray-200 rounded-lg outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Tên sản phẩm</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full p-3 border border-gray-200 rounded-lg outline-none" required />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Thương hiệu</label>
              <select name="brandId" value={formData.brandId || ''} onChange={handleInputChange} className="w-full p-3 border border-gray-200 rounded-lg bg-white" required>
                <option value="">-- Chọn Thương hiệu --</option>
                {brands.map(b => {
                  const id = b.brand_id || b.id;
                  const name = b.brand_name || b.name;
                  return <option key={id} value={id}>{name}</option>;
                })}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Danh mục</label>
              <select name="catId" value={formData.catId || ''} onChange={handleInputChange} className="w-full p-3 border border-gray-200 rounded-lg bg-white" required>
                <option value="">-- Chọn Danh mục --</option>
                {categories.map(c => {
                  const id = c.category_id || c.cat_id || c.id;
                  const name = c.category_name || c.cat_name || c.name;
                  return <option key={id} value={id}>{name}</option>;
                })}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Giá niêm yết (₫)</label>
              <input type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full p-3 border border-gray-200 rounded-lg" required />
            </div>
            {!editingId && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Số lượng nhập</label>
                <input type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} className="w-full p-3 border border-gray-200 rounded-lg" required />
              </div>
            )}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Bảo hành (tháng)</label>
              <input type="text" name="warranty" value={formData.warranty} onChange={handleInputChange} className="w-full p-3 border border-gray-200 rounded-lg" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Mô tả chi tiết</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" className="w-full p-3 border border-gray-200 rounded-lg"></textarea>
          </div>

          {/* GIAO DIỆN UPLOAD ẢNH ĐƯỢC TINH CHỈNH GỌN GÀNG */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Ảnh sản phẩm</label>
            <div className="flex items-center gap-6 border p-4 rounded-lg bg-gray-50">
              
              {/* Hiện ảnh từ Database (Nếu đang sửa và chưa chọn ảnh mới) */}
              {editingId && formData.currentImageUrl && !selectedImageFile && (
                <div className="text-center">
                  <p className="text-[10px] text-gray-400 mb-1">Ảnh hiện tại:</p>
                  <img src={formData.currentImageUrl} alt="Current" className="w-16 h-16 object-contain rounded border bg-white" />
                </div>
              )}

              {/* Tính năng mới: Hiện ảnh Preview từ máy tính ngay lập tức */}
              {selectedImageFile && (
                <div className="text-center">
                  <p className="text-[10px] text-blue-500 font-bold mb-1">Sẽ tải lên:</p>
                  <img src={URL.createObjectURL(selectedImageFile)} alt="Preview" className="w-16 h-16 object-contain rounded border border-blue-400 bg-white shadow-sm" />
                </div>
              )}

              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => setSelectedImageFile(e.target.files[0])} 
                className="flex-1 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 cursor-pointer outline-none" 
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={() => { setIsAddingNew(false); setEditingId(null); setSelectedImageFile(null); }} className="px-6 py-2.5 font-bold text-gray-600 border rounded-lg hover:bg-gray-50">Hủy</button>
            <button type="submit" className="px-6 py-2.5 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700">Lưu sản phẩm</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Kho hàng</h1>
        <button onClick={() => { setIsAddingNew(true); setEditingId(null); setSelectedImageFile(null); setFormData({ sku:'', name:'', brandId:'', catId:'', price:'', quantity:'', warranty:'', description:'', currentImageUrl:'' }); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 shadow-md">
          + Nhập hàng mới
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase border-b">
            <tr>
              <th className="px-6 py-4">Sản phẩm</th>
              <th className="px-6 py-4 text-center">Ảnh</th>
              <th className="px-6 py-4">Danh mục</th>
              <th className="px-6 py-4">Giá bán</th>
              <th className="px-6 py-4">Tồn kho</th>
              <th className="px-6 py-4">Trạng thái</th>
              <th className="px-6 py-4 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((item) => {
              // Kết hợp Backend URL vào ảnh để hiển thị
              let productImageUrl = null;
              if (item.image_url) {
                // Nếu DB thiếu dấu '/', ta tự động thêm vào
                const formattedPath = item.image_url.startsWith('/') ? item.image_url : `/${item.image_url}`;
                productImageUrl = `${BACKEND_URL}${formattedPath}`;
              }
              
              return (
                <tr key={item.pro_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <p className="font-bold text-gray-900">{item.pro_name}</p>
                      <span className="text-[10px] text-gray-400 font-mono">SKU: {item.pro_sku}</span>
                    </div>
                  </td>
                  
                  {/* Ô CHỨA ẢNH ĐƯỢC THU NHỎ GỌN GÀNG (object-contain giúp ảnh không bị cắt xén) */}
                  <td className="px-6 py-4 flex justify-center">
                    {productImageUrl ? (
                      <div className="w-14 h-14 p-1 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center justify-center">
                        {/* object-contain giúp ảnh luôn giữ đúng tỷ lệ, không bị cắt xén, nằm gọn trong viền */}
                        <img 
                          src={productImageUrl} 
                          alt={item.pro_name} 
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-14 h-14 bg-gray-50 rounded-lg border border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs">
                        No IMG
                      </div>
                    )}
                  </td>
                  
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {item.cat_name || "Chưa phân loại"}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.pro_price)}
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-medium">
                    {item.pro_quantity} sản phẩm
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-[10px] font-bold rounded-full ${
                      item.pro_quantity > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {item.pro_quantity > 0 ? 'CÒN HÀNG' : 'HẾT HÀNG'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-3">
                      <button onClick={() => handleEditClick(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Sửa thông tin">✏️</button>
                      <button onClick={() => handleDelete(item.pro_id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Xóa vĩnh viễn">🗑️</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductManagement;