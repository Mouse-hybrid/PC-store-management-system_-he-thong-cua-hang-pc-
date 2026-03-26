// src/pages/Admin/CategoryManagement.jsx
import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';

const CategoryManagement = () => {
  const [activeTab, setActiveTab] = useState('categories'); 
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  
  // THÊM: Biến lưu ID khi đang sửa (nếu null là thêm mới)
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    cat_name: '', description: '', 
    brand_name: '', brand_slug: '', logo_url: '' 
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [catRes, brandRes] = await Promise.all([
        axiosClient.get('/products/catalog/categories'),
        axiosClient.get('/products/catalog/brands')
      ]);
      setCategories(catRes.data || []);
      setBrands(brandRes.data || []);
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // THÊM: Hàm xử lý khi bấm nút "Sửa"
  const handleEditClick = (item, type) => {
    if (type === 'categories') {
      setFormData({
        cat_name: item.cat_name || '',
        description: item.description || '',
        brand_name: '', brand_slug: '', logo_url: ''
      });
      setEditingId(item.category_id);
    } else {
      setFormData({
        cat_name: '', description: '',
        brand_name: item.brand_name || '',
        brand_slug: item.brand_slug || '',
        logo_url: item.logo_url || ''
      });
      setEditingId(item.brand_id);
    }
    setIsAddingNew(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (activeTab === 'categories') {
        if (editingId) {
          // GỌI API SỬA (PUT)
          await axiosClient.put(`/products/catalog/categories/${editingId}`, {
            cat_name: formData.cat_name, description: formData.description
          });
          alert("Cập nhật danh mục thành công!");
        } else {
          // GỌI API THÊM (POST)
          await axiosClient.post('/products/catalog/categories', {
            cat_name: formData.cat_name, description: formData.description
          });
          alert("Thêm danh mục thành công!");
        }
      } else {
        if (editingId) {
          // GỌI API SỬA (PUT)
          await axiosClient.put(`/products/catalog/brands/${editingId}`, {
            brand_name: formData.brand_name, brand_slug: formData.brand_slug, logo_url: formData.logo_url
          });
          alert("Cập nhật thương hiệu thành công!");
        } else {
          // GỌI API THÊM (POST)
          await axiosClient.post('/products/catalog/brands', {
            brand_name: formData.brand_name, brand_slug: formData.brand_slug, logo_url: formData.logo_url
          });
          alert("Thêm thương hiệu thành công!");
        }
      }
      
      // Reset form
      setIsAddingNew(false);
      setEditingId(null);
      setFormData({ cat_name: '', description: '', brand_name: '', brand_slug: '', logo_url: '' });
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Lỗi khi lưu dữ liệu");
    }
  };

  if (isAddingNew) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {editingId ? 'Chỉnh sửa ' : 'Thêm mới '}
          {activeTab === 'categories' ? 'Danh mục' : 'Thương hiệu'}
        </h2>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
          
          {activeTab === 'categories' ? (
            <>
              <div>
                <label className="block text-sm font-bold mb-2">Tên Danh mục</label>
                <input type="text" name="cat_name" value={formData.cat_name} onChange={handleInputChange} className="w-full p-3 border rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Mô tả chi tiết</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" className="w-full p-3 border rounded-lg"></textarea>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-bold mb-2">Tên Thương hiệu</label>
                <input type="text" name="brand_name" value={formData.brand_name} onChange={handleInputChange} className="w-full p-3 border rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Slug (Tên viết liền không dấu)</label>
                <input type="text" name="brand_slug" value={formData.brand_slug} onChange={handleInputChange} placeholder="vd: asus-rog" className="w-full p-3 border rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">URL Logo</label>
                <input type="text" name="logo_url" value={formData.logo_url} onChange={handleInputChange} className="w-full p-3 border rounded-lg" />
              </div>
            </>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={() => { setIsAddingNew(false); setEditingId(null); }} className="px-6 py-2 border rounded-lg font-bold text-gray-600 hover:bg-gray-50">Hủy</button>
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700">Lưu thông tin</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Cấu hình Sản phẩm</h1>
        <button onClick={() => { setIsAddingNew(true); setEditingId(null); setFormData({cat_name:'', description:'', brand_name:'', brand_slug:'', logo_url:''}); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700">
          + Thêm {activeTab === 'categories' ? 'Danh mục' : 'Thương hiệu'}
        </button>
      </div>

      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button 
          onClick={() => setActiveTab('categories')}
          className={`pb-3 px-4 font-bold ${activeTab === 'categories' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          🗂️ Quản lý Danh mục
        </button>
        <button 
          onClick={() => setActiveTab('brands')}
          className={`pb-3 px-4 font-bold ${activeTab === 'brands' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          🏷️ Quản lý Thương hiệu
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase border-b">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">{activeTab === 'categories' ? 'Tên Danh mục' : 'Tên Thương hiệu'}</th>
              <th className="px-6 py-4">{activeTab === 'categories' ? 'Mô tả' : 'Slug'}</th>
              <th className="px-6 py-4 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {activeTab === 'categories' 
              ? categories.map((item) => (
                  <tr key={`cat-${item.category_id}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-sm text-gray-400">#{item.category_id}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">{item.cat_name}</td>
                    <td className="px-6 py-4 text-gray-500 text-sm">{item.description || '-'}</td>
                    {/* ĐÃ GẮN SỰ KIỆN ONCLICK */}
                    <td className="px-6 py-4 text-center">
                      <button onClick={() => handleEditClick(item, 'categories')} className="text-blue-600 font-medium">Sửa</button>
                    </td>
                  </tr>
                ))
              : brands.map((item) => (
                  <tr key={`brand-${item.brand_id}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-sm text-gray-400">#{item.brand_id}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">{item.brand_name}</td>
                    <td className="px-6 py-4 text-gray-500 text-sm font-mono">{item.brand_slug}</td>
                    {/* ĐÃ GẮN SỰ KIỆN ONCLICK */}
                    <td className="px-6 py-4 text-center">
                      <button onClick={() => handleEditClick(item, 'brands')} className="text-blue-600 font-medium">Sửa</button>
                    </td>
                  </tr>
                ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryManagement;