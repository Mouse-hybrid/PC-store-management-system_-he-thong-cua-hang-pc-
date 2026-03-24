import { Search, Bell, HelpCircle, ChevronDown } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white h-16 flex items-center justify-between px-8 border-b border-gray-200 shrink-0">
      {/* Search Bar */}
      <div className="flex-1 max-w-2xl">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-gray-400 absolute left-3" />
          <input
            type="text"
            placeholder="Search orders, items..."
            className="w-full bg-gray-50 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-6 ml-4">
        {/* Icons */}
        <div className="flex items-center gap-4 text-gray-500">
          <button className="hover:text-gray-800 relative transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <button className="hover:text-gray-800 transition-colors">
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Dropdown */}
        <div className="flex items-center gap-3 border-l border-gray-200 pl-6 cursor-pointer group">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-800 group-hover:text-blue-600 transition-colors">Alex Johnson</p>
            <p className="text-xs text-gray-500">Floor Manager</p>
          </div>
          <img 
            src="https://ui-avatars.com/api/?name=Alex+Johnson&background=ffedd5&color=c2410c" 
            alt="Profile" 
            className="w-8 h-8 rounded-full"
          />
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </header>
  );
}