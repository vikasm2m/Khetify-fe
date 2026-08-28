import React, { useContext } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { LayoutDashboard, Store, Package, LogOut, ClipboardList, User } from 'lucide-react';

export default function FarmerLayout() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname.includes(path);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col">
        <div className="h-16 flex items-center px-6 border-b">
          <span className="text-xl font-bold text-green-700">FarmConnect</span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link to="/farmer/dashboard" className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive('/farmer/dashboard') ? 'bg-green-100 text-green-800 font-semibold' : 'text-gray-700 hover:bg-green-50 hover:text-green-700'}`}>
            <LayoutDashboard className="w-5 h-5 mr-3" /> Dashboard
          </Link>
          <Link to="/farmer/shop" className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive('/farmer/shop') ? 'bg-green-100 text-green-800 font-semibold' : 'text-gray-700 hover:bg-green-50 hover:text-green-700'}`}>
            <Store className="w-5 h-5 mr-3" /> My Shop
          </Link>
          <Link to="/farmer/products" className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive('/farmer/products') ? 'bg-green-100 text-green-800 font-semibold' : 'text-gray-700 hover:bg-green-50 hover:text-green-700'}`}>
            <Package className="w-5 h-5 mr-3" /> Products
          </Link>
          <Link to="/farmer/orders" className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive('/farmer/orders') ? 'bg-green-100 text-green-800 font-semibold' : 'text-gray-700 hover:bg-green-50 hover:text-green-700'}`}>
            <ClipboardList className="w-5 h-5 mr-3" /> Orders
          </Link>
          <Link to="/farmer/profile" className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive('/farmer/profile') ? 'bg-green-100 text-green-800 font-semibold' : 'text-gray-700 hover:bg-green-50 hover:text-green-700'}`}>
            <User className="w-5 h-5 mr-3" /> My Profile
          </Link>
        </nav>
        <div className="p-4 border-t">
          <button onClick={handleLogout} className="flex w-full items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg">
            <LogOut className="w-5 h-5 mr-3" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
