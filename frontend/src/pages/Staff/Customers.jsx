import React, { useState } from 'react';
import { 
  CheckCircle2, Edit3, MessageSquare, Mail, Phone, MapPin, 
  Monitor, Laptop, Filter, Download, Eye, MoreVertical 
} from 'lucide-react';

// --- MOCK DATA ---
const customerData = {
  id: 'CUST-8829',
  name: 'Hoàng',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
  isVerified: true,
  joined: 'Jan 2023',
  stats: { orders: 12, spent: '$4,250', warranties: 2 },
  contact: {
    email: 'sarah.chen@example.com', // Giữ nguyên theo ảnh thiết kế
    phone: '+1 (555) 982-3412',
    address: '482 Oakwood Ave, Apt 12C\nSan Francisco, CA 94110'
  },
  warranties: [
    { id: 1, product: 'Custom PC Build #X92', type: 'GAMING RIG PRO', status: 'ACTIVE', end: 'Dec 15, 2025', progress: 85, icon: Monitor },
    { id: 2, product: 'Razer Blade 15 2023', type: 'PREMIUM SUPPORT', status: 'ACTIVE', end: 'Mar 08, 2026', progress: 40, icon: Laptop }
  ],
  recentOrders: [
    { id: '#ORD-90234', product: 'RTX 4090 Gaming Build', date: 'Oct 12, 2023', amount: '$3,499.00', status: 'DELIVERED' },
    { id: '#ORD-88211', product: 'Logitech G Pro Mouse', date: 'Sep 28, 2023', amount: '$129.99', status: 'DELIVERED' },
    { id: '#ORD-87102', product: 'LG UltraGear 27" Monitor', date: 'Aug 05, 2023', amount: '$449.00', status: 'DELIVERED' },
    { id: '#ORD-86044', product: 'Keychron Q8 Keyboard', date: 'Jun 14, 2023', amount: '$199.50', status: 'RETURNED' }
  ]
};

// Helper tô màu Status Đơn hàng
const getStatusColor = (status) => {
  return status === 'DELIVERED' 
    ? 'bg-emerald-100 text-emerald-700' 
    : 'bg-orange-100 text-orange-700';
};

export default function Customers() {
  // State để mô phỏng tương tác UI
  const [isMessageOpen, setIsMessageOpen] = useState(false);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* 1. Header Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          
          {/* Avatar & Info */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <img 
                src={customerData.avatar} 
                alt={customerData.name} 
                className="w-24 h-24 rounded-full object-cover border-4 border-gray-50 shadow-sm"
              />
              {customerData.isVerified && (
                <div className="absolute bottom-1 right-1 bg-white rounded-full p-0.5 shadow-sm">
                  <CheckCircle2 className="w-6 h-6 text-blue-500 fill-blue-100" />
                </div>
              )}
            </div>
            
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-gray-800">{customerData.name}</h1>
                <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide">
                  Verified Account
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-4 flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-gray-200 inline-block"></span> 
                Customer since {customerData.joined}
              </p>
              
              <div className="flex gap-3">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors shadow-sm">
                  <Edit3 className="w-4 h-4" /> Edit Profile
                </button>
                <button 
                  onClick={() => setIsMessageOpen(!isMessageOpen)}
                  className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" /> {isMessageOpen ? 'Close Chat' : 'Send Message'}
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-8 bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800">{customerData.stats.orders}</p>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">Orders</p>
            </div>
            <div className="w-px bg-gray-200"></div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{customerData.stats.spent}</p>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">Spent</p>
            </div>
            <div className="w-px bg-gray-200"></div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800">{customerData.stats.warranties}</p>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">Warranties</p>
            </div>
          </div>
          
        </div>

        {/* Khung chat giả lập bật xuống khi bấm "Send Message" */}
        {isMessageOpen && (
          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100 animate-in fade-in slide-in-from-top-4">
             <textarea 
               className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
               rows="3"
               placeholder={`Write a message to ${customerData.name}...`}
             ></textarea>
             <div className="flex justify-end mt-2">
               <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">Send</button>
             </div>
          </div>
        )}
      </div>

      {/* 2. Middle Grid: Contact & Warranty */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Contact Information */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><Mail className="w-4 h-4" /></span>
              Contact Information
            </h3>
            <button className="text-sm font-semibold text-blue-600 hover:underline">Update</button>
          </div>
          
          <div className="space-y-6 flex-1">
            <div className="flex gap-4 items-start">
              <div className="p-2 bg-gray-50 rounded-full text-gray-400 mt-0.5"><Mail className="w-4 h-4" /></div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Email Address</p>
                <p className="font-semibold text-gray-800">{customerData.contact.email}</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="p-2 bg-gray-50 rounded-full text-gray-400 mt-0.5"><Phone className="w-4 h-4" /></div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Phone Number</p>
                <p className="font-semibold text-gray-800">{customerData.contact.phone}</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="p-2 bg-gray-50 rounded-full text-gray-400 mt-0.5"><MapPin className="w-4 h-4" /></div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Primary Address</p>
                <p className="font-semibold text-gray-800 whitespace-pre-line">{customerData.contact.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Active Warranty Coverage */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><CheckCircle2 className="w-4 h-4" /></span>
              Active Warranty Coverage
            </h3>
            <button className="text-gray-400 hover:text-gray-600"><MoreVertical className="w-5 h-5" /></button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {customerData.warranties.map((warranty) => (
              <div key={warranty.id} className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer bg-gray-50/30">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-3 items-center">
                    <div className="p-2.5 bg-white border border-gray-100 rounded-lg text-blue-600 shadow-sm">
                      <warranty.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm">{warranty.product}</h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">{warranty.type}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">{warranty.status}</span>
                </div>
                
                <div>
                  <div className="flex justify-between text-xs mb-1.5 font-medium">
                    <span className="text-gray-500">Coverage ends:</span>
                    <span className="text-gray-800 font-bold">{warranty.end}</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${warranty.progress}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-auto py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl transition-colors">
            View Full Service History
          </button>
        </div>
      </div>

      {/* 3. Bottom Table: Recent Orders */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><Monitor className="w-4 h-4" /></span>
            Recent Orders
          </h3>
          <div className="flex gap-2">
            <button className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50"><Filter className="w-4 h-4" /></button>
            <button className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50"><Download className="w-4 h-4" /></button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="font-semibold text-gray-400 uppercase tracking-wider bg-gray-50/50">
                <th className="p-4 pl-6">ORDER ID</th>
                <th className="p-4">PRODUCT NAME</th>
                <th className="p-4">DATE</th>
                <th className="p-4">AMOUNT</th>
                <th className="p-4">STATUS</th>
                <th className="p-4 pr-6 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {customerData.recentOrders.map((order, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 pl-6 font-bold text-blue-600">{order.id}</td>
                  <td className="p-4 font-semibold text-gray-800">{order.product}</td>
                  <td className="p-4 text-gray-500">{order.date}</td>
                  <td className="p-4 font-bold text-gray-800">{order.amount}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-center">
                    <button className="text-gray-400 hover:text-blue-600 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}