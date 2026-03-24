import React, { useState } from 'react';
import { Download, Plus, Search, MoreHorizontal, X, Box, MapPin, Phone } from 'lucide-react';

// --- MOCK DATA ---
const mockOrders = [
  { id: '#ORD-9921', customer: 'Jonathan Wick', email: 'jw@continental.com', product: 'NVIDIA RTX 4090 FE', qty: 1, payment: 'Verified', status: 'Processing', total: '$1,599.00' },
  { id: '#ORD-9918', customer: 'Sarah Connor', email: 'sarah@resistance.org', product: 'Intel i9-14900K Box', qty: 2, payment: 'Pending', status: 'Pending', total: '$1,198.00' },
  { id: '#ORD-9915', customer: 'Ellen Ripley', email: 'ripley@weyland.com', product: 'Samsung 990 Pro 2TB', qty: 5, payment: 'Verified', status: 'Shipped', total: '$845.00' },
  { id: '#ORD-9910', customer: 'Tony Stark', email: 'tony@starkindustries.com', address: '10880 Malibu Point, California, 90265', phone: '+1 800-IRON-MAN', product: 'ASUS ROG Maximus Z790', sku: 'MB-AS-Z790-H', qty: 1, payment: 'Verified', status: 'Processing', subtotal: '$629.99', shipping: '$25.00', tax: '$50.40', total: '$705.39' },
];

const tabs = ['All Orders', 'Pending', 'Processing', 'Shipped', 'Completed'];

// Helper function để tô màu Status
const getStatusBadge = (status) => {
  const styles = {
    Processing: 'bg-yellow-100 text-yellow-700',
    Shipped: 'bg-blue-100 text-blue-700',
    Pending: 'bg-gray-100 text-gray-700',
    Completed: 'bg-emerald-100 text-emerald-700',
    Verified: 'bg-emerald-100 text-emerald-700'
  };
  return styles[status] || 'bg-gray-100 text-gray-700';
};

export default function Orders() {
  // --- STATE MANAGEMENT ---
  const [activeTab, setActiveTab] = useState('All Orders');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Lọc dữ liệu dựa trên tab đang chọn
  const filteredOrders = activeTab === 'All Orders' 
    ? mockOrders 
    : mockOrders.filter(order => order.status === activeTab);

  return (
    <div className="flex h-full gap-6 relative overflow-hidden">
      
      {/* KHUNG CHÍNH (Bảng Orders) */}
      <div className={`flex-1 flex flex-col transition-all duration-300 bg-white rounded-2xl shadow-sm border border-gray-100`}>
        
        {/* Header của bảng */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div className="flex gap-6 border-b border-gray-100 w-full md:w-auto">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm font-semibold transition-colors relative ${
                  activeTab === tab ? 'text-blue-600' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></span>
                )}
              </button>
            ))}
          </div>
          
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" /> Export CSV
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm">
              <Plus className="w-4 h-4" /> Manual Order
            </button>
          </div>
        </div>

        {/* Bảng dữ liệu */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50/50 border-b border-gray-100">
                <th className="p-4 pl-6">ORDER ID</th>
                <th className="p-4">CUSTOMER NAME</th>
                <th className="p-4">PRODUCT</th>
                <th className="p-4">QTY</th>
                <th className="p-4">PAYMENT</th>
                <th className="p-4">STATUS</th>
                <th className="p-4 pr-6 text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredOrders.map((order, idx) => (
                <tr 
                  key={idx} 
                  onClick={() => setSelectedOrder(order)} // Click vào hàng để mở chi tiết
                  className={`hover:bg-gray-50 transition-colors cursor-pointer ${selectedOrder?.id === order.id ? 'bg-blue-50/50' : ''}`}
                >
                  <td className="p-4 pl-6 font-bold text-blue-600">{order.id}</td>
                  <td className="p-4 font-semibold text-gray-800">{order.customer}</td>
                  <td className="p-4 text-gray-600">{order.product}</td>
                  <td className="p-4 text-gray-800">{order.qty}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-md text-[11px] font-bold ${getStatusBadge(order.payment)}`}>
                      {order.payment}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-md text-[11px] font-bold ${getStatusBadge(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-center">
                    <button className="text-gray-400 hover:text-blue-600 transition-colors">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Footer phân trang */}
        <div className="p-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
          <p>Showing {filteredOrders.length} of 124 orders</p>
          <div className="flex gap-2">
             <button className="p-1 border border-gray-200 rounded hover:bg-gray-50">&lt;</button>
             <button className="p-1 border border-gray-200 rounded hover:bg-gray-50">&gt;</button>
          </div>
        </div>
      </div>

      {/* KHUNG ORDER DETAILS (Slide-over panel - Ảnh 3) */}
      {selectedOrder && (
        <div className="w-96 bg-white border border-gray-100 rounded-2xl shadow-lg flex flex-col animate-in slide-in-from-right duration-300">
          {/* Header Modal */}
          <div className="p-6 border-b border-gray-100 flex justify-between items-start">
            <div>
              <h2 className="text-lg font-bold text-gray-800">Order Details</h2>
              <p className="text-sm text-gray-500">{selectedOrder.id}</p>
            </div>
            <button 
              onClick={() => setSelectedOrder(null)} // Đóng panel
              className="text-gray-400 hover:text-gray-700 bg-gray-50 p-1 rounded-md"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nội dung chi tiết */}
          <div className="p-6 flex-1 overflow-y-auto space-y-6">
            
            {/* Customer Info */}
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">Customer Info</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                  {selectedOrder.customer.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{selectedOrder.customer}</p>
                  <p className="text-sm text-gray-500">{selectedOrder.email}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex gap-2"><MapPin className="w-4 h-4 text-gray-400" /> {selectedOrder.address || 'N/A'}</div>
                <div className="flex gap-2"><Phone className="w-4 h-4 text-gray-400" /> {selectedOrder.phone || 'N/A'}</div>
              </div>
            </div>

            {/* Items */}
            <div>
               <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">Items ({selectedOrder.qty})</h3>
               <div className="flex gap-4 p-3 bg-gray-50 rounded-xl">
                 <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                   <Box className="w-6 h-6 text-gray-400" />
                 </div>
                 <div className="flex-1">
                   <p className="text-sm font-semibold text-gray-800">{selectedOrder.product}</p>
                   <p className="text-xs text-gray-500">SKU: {selectedOrder.sku || 'N/A'}</p>
                   <div className="flex justify-between items-center mt-1">
                     <p className="text-sm text-gray-600">Qty: {selectedOrder.qty}</p>
                     <p className="text-sm font-bold text-blue-600">{selectedOrder.subtotal || selectedOrder.total}</p>
                   </div>
                 </div>
               </div>
            </div>

            {/* Summary */}
            <div>
               <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">Summary</h3>
               <div className="space-y-2 text-sm text-gray-600 border-b border-gray-100 pb-3">
                 <div className="flex justify-between"><p>Subtotal</p><p>{selectedOrder.subtotal || selectedOrder.total}</p></div>
                 <div className="flex justify-between"><p>Shipping (Express)</p><p>{selectedOrder.shipping || '$0.00'}</p></div>
                 <div className="flex justify-between"><p>Tax (8%)</p><p>{selectedOrder.tax || '$0.00'}</p></div>
               </div>
               <div className="flex justify-between items-center pt-3">
                 <p className="font-bold text-gray-800">Total</p>
                 <p className="text-xl font-bold text-blue-600">{selectedOrder.total}</p>
               </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-gray-100 space-y-3">
            <button className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
              Print Packing Slip
            </button>
            <div className="flex gap-3">
              <button className="flex-1 py-2.5 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors">
                Edit Order
              </button>
              <button className="flex-1 py-2.5 border border-red-200 text-red-600 font-semibold rounded-xl hover:bg-red-50 transition-colors">
                Cancel Order
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}