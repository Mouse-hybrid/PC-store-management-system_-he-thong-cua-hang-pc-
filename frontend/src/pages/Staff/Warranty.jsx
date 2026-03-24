import React, { useState } from 'react';
import { 
  Search, ShieldCheck, CheckCircle2, XCircle, 
  PlusCircle, Edit, Printer, User, Mail, Phone, MapPin, Clock 
} from 'lucide-react';

// --- MOCK DATA ---
const mockWarrantyData = {
  serialNumber: 'SN-8829-4401',
  productName: 'Ultima Pro Smartwatch',
  variant: 'Midnight Black Edition - 44mm',
  status: 'ACTIVE WARRANTY',
  orderId: '#ORD-2024-9981',
  purchaseDate: 'Oct 12, 2023',
  batchCode: 'BC-992-X',
  expirationDate: 'Oct 11, 2025',
  daysRemaining: 425,
  progressPercentage: 65, // Tính toán giả lập % thời gian còn lại
  coverage: [
    { name: 'Hardware Support', desc: 'Covered until expiration date', active: true },
    { name: 'Parts Replacement', desc: 'Full parts coverage included', active: true },
    { name: 'Technical Support', desc: '24/7 Priority chat access', active: true },
    { name: 'Accidental Damage', desc: 'Not included in basic plan', active: false },
  ],
  customer: {
    name: 'Sarah Williams',
    type: 'Premium Member',
    email: 's.williams@example.com',
    phone: '+1 (555) 0123-4567',
    address: 'San Francisco, CA'
  }
};

export default function Warranty() {
  const [searchInput, setSearchInput] = useState('SN-8829-4401');
  const [isSearching, setIsSearching] = useState(false);

  // Giả lập hàm gọi API tra cứu
  const handleVerify = () => {
    setIsSearching(true);
    setTimeout(() => setIsSearching(false), 500); // Fake delay 0.5s
  };

  const data = mockWarrantyData;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* 1. Page Header & Search Bar */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Warranty Lookup</h1>
        <p className="text-sm text-gray-500 mt-1 mb-6">Verify product coverage and service history instantly.</p>
        
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 items-center">
          <div className="relative flex-1">
            <ScanBarcodeIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Enter Serial Number or IMEI..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3 text-sm font-medium text-gray-800 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
            />
          </div>
          <button 
            onClick={handleVerify}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-2 transition-colors shadow-sm"
          >
            {isSearching ? <Clock className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            Verify Coverage
          </button>
        </div>
      </div>

      {/* 2. Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Lõi bên trái: Product Info & Coverage (Chiếm 2 cột) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Product Information Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold text-gray-800">Product Information</h3>
              <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {data.status}
              </span>
            </div>
            
            <div className="flex gap-6 items-center">
              <div className="w-32 h-32 bg-gray-50 rounded-xl border border-gray-100 flex-shrink-0 flex items-center justify-center overflow-hidden">
                {/* Thay ảnh thực tế của bạn vào đây */}
                <img src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=200" alt="Product" className="object-cover" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-800">{data.productName}</h2>
                <p className="text-sm text-gray-500 mt-1 mb-4">{data.variant}</p>
                
                <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                  <div>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">SERIAL NUMBER</p>
                    <p className="font-semibold text-gray-800">{data.serialNumber}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">ORDER ID</p>
                    <p className="font-semibold text-blue-600 cursor-pointer hover:underline">{data.orderId}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">PURCHASE DATE</p>
                    <p className="font-semibold text-gray-800">{data.purchaseDate}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">BATCH CODE</p>
                    <p className="font-semibold text-gray-800">{data.batchCode}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Warranty & Coverage Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-bold text-gray-800 mb-6">Warranty & Coverage</h3>
            
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-end mb-2">
                <p className="text-sm font-semibold text-gray-600">Warranty Progress</p>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-800">{data.daysRemaining} Days Remaining</p>
                  <p className="text-[11px] font-bold text-gray-400 uppercase">EXPIRATION <span className="text-blue-600">{data.expirationDate}</span></p>
                </div>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 rounded-full" 
                  style={{ width: `${data.progressPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Coverage Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.coverage.map((item, idx) => (
                <div key={idx} className={`p-4 rounded-xl border ${item.active ? 'bg-blue-50/50 border-blue-100' : 'bg-gray-50 border-gray-100'} flex gap-3`}>
                  <div className="mt-0.5">
                    {item.active ? (
                      <CheckCircle2 className="w-5 h-5 text-blue-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${item.active ? 'text-gray-800' : 'text-gray-500'}`}>{item.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Cột bên phải: Actions & Info (Chiếm 1 cột) */}
        <div className="space-y-6">
          
          {/* Quick Actions (Nền xanh) */}
          <div className="bg-blue-600 rounded-2xl shadow-sm p-6 text-white">
            <h3 className="text-sm font-bold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full bg-white text-blue-600 hover:bg-gray-50 font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
                <PlusCircle className="w-5 h-5" /> Create New Claim
              </button>
              <button className="w-full bg-blue-700/50 hover:bg-blue-700 border border-blue-500 font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
                <Edit className="w-5 h-5" /> Modify Warranty
              </button>
              <button className="w-full bg-blue-700/50 hover:bg-blue-700 border border-blue-500 font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
                <Printer className="w-5 h-5" /> Print Certificate
              </button>
            </div>
          </div>

          {/* Claim History */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-bold text-gray-800 mb-4">Claim History</h3>
            <div className="flex gap-3 text-gray-400 items-start">
               <div className="w-2 h-2 mt-2 rounded-full bg-gray-300"></div>
               <div>
                 <p className="text-sm font-semibold text-gray-500">No claims found</p>
                 <p className="text-xs mt-1">This device has not had any service requests recorded.</p>
               </div>
            </div>
          </div>

          {/* Customer Contact */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-bold text-gray-800 mb-4">Customer Contact</h3>
            
            <div className="flex gap-3 items-center mb-6 border-b border-gray-100 pb-4">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="font-bold text-gray-800">{data.customer.name}</p>
                <p className="text-xs font-semibold text-blue-600">{data.customer.type}</p>
              </div>
            </div>
            
            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-3 text-gray-600">
                <Mail className="w-4 h-4 text-gray-400" />
                <p>{data.customer.email}</p>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Phone className="w-4 h-4 text-gray-400" />
                <p>{data.customer.phone}</p>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <MapPin className="w-4 h-4 text-gray-400" />
                <p>{data.customer.address}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Icon tùy chỉnh nhỏ cho thanh search giống thiết kế
function ScanBarcodeIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7V5a2 2 0 0 1 2-2h2"></path>
      <path d="M17 3h2a2 2 0 0 1 2 2v2"></path>
      <path d="M21 17v2a2 2 0 0 1-2 2h-2"></path>
      <path d="M7 21H5a2 2 0 0 1-2-2v-2"></path>
      <path d="M8 7v10"></path>
      <path d="M12 7v10"></path>
      <path d="M16 7v10"></path>
    </svg>
  );
}