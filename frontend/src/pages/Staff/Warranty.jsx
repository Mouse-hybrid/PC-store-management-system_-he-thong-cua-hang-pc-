// src/pages/Staff/Warranty.jsx
import React, { useState } from 'react';
import { Search, ShieldCheck, CheckCircle2, XCircle, Mail, Phone, MapPin, Clock, RefreshCw } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

export default function Warranty() {
  const [serialInput, setSerialInput] = useState('');
  const [warrantyInfo, setWarrantyInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!serialInput) return;

    try {
      setLoading(true);
      setError('');
      // GỌI API TRA CỨU BẢO HÀNH (Giả sử endpoint là /inventory/warranty/:serial)
      const res = await axiosClient.get(`/inventory/warranty/${serialInput}`);
      setWarrantyInfo(res.data?.data || res.data);
    } catch (err) {
      setWarrantyInfo(null);
      setError(err.response?.data?.message || 'Không tìm thấy thông tin bảo hành cho Serial này.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* 1. Thanh tìm kiếm Serial */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Warranty Lookup</h1>
        <p className="text-sm text-gray-500 mb-6">Tra cứu thời hạn bảo hành chính hãng qua mã Serial Number (S/N).</p>
        
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Nhập mã Serial Number (VD: SN-12345)..."
              value={serialInput}
              onChange={(e) => setSerialInput(e.target.value.toUpperCase())}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
            Kiểm tra ngay
          </button>
        </form>
      </div>

      {/* 2. Hiển thị kết quả */}
      {error && (
        <div className="bg-red-50 border border-red-100 p-4 rounded-xl text-red-600 text-sm font-medium">
           ⚠️ {error}
        </div>
      )}

      {warrantyInfo && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
          {/* Thông tin sản phẩm */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between mb-6">
                <h3 className="font-bold text-gray-800">Thông tin sản phẩm</h3>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                  warrantyInfo.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                }`}>
                  {warrantyInfo.status === 'ACTIVE' ? 'Còn bảo hành' : 'Hết bảo hành'}
                </span>
              </div>
              <div className="flex gap-6">
                <div className="w-24 h-24 bg-gray-50 rounded-xl border flex items-center justify-center text-3xl">💻</div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-800">{warrantyInfo.pro_name}</h2>
                  <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                    <div>
                      <p className="text-gray-400 uppercase text-[10px] font-bold">Serial Number</p>
                      <p className="font-semibold">{warrantyInfo.serial_number}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 uppercase text-[10px] font-bold">Mã Đơn Hàng</p>
                      <p className="font-semibold text-blue-600">#{warrantyInfo.order_id}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Thời gian bảo hành */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-6">Thời hạn bảo hành</h3>
              <div className="space-y-4">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-gray-500">Ngày hết hạn dự kiến:</span>
                  <span className="text-gray-900 font-bold">{new Date(warrantyInfo.expiry_date).toLocaleDateString('vi-VN')}</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: '70%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Liên hệ khách hàng */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-6 border-b pb-4">Chủ sở hữu</h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-gray-400" />
                <p>Ngày mua: {new Date(warrantyInfo.purchase_date).toLocaleDateString('vi-VN')}</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-400" />
                <p>{warrantyInfo.guest_phone || 'N/A'}</p>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-gray-400" />
                <p className="truncate">{warrantyInfo.shipping_address || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}