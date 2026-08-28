import React, { useContext } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Shield, Users, Store, LogOut } from 'lucide-react';

export default function AdminLayout() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-800">
          <Shield className="w-6 h-6 text-green-500 mr-2" />
          <span className="text-xl font-bold tracking-wider">Admin Portal</span>
        </div>
        <nav className="flex-1 p-4 space-y-2 mt-4">
          <Link 
            to="/admin/dashboard" 
            className={`flex items-center px-4 py-3 rounded-lg transition-colors ${location.pathname === '/admin/dashboard' ? 'bg-green-600 text-white' : 'text-gray-300 hover:bg-gray-800'}`}
          >
            <Shield className="w-5 h-5 mr-3" /> Dashboard
          </Link>
          <Link 
            to="/admin/users" 
            className={`flex items-center px-4 py-3 rounded-lg transition-colors ${location.pathname === '/admin/users' ? 'bg-green-600 text-white' : 'text-gray-300 hover:bg-gray-800'}`}
          >
            <Users className="w-5 h-5 mr-3" /> Manage Users
          </Link>
          <Link 
            to="/admin/shops" 
            className={`flex items-center px-4 py-3 rounded-lg transition-colors ${location.pathname === '/admin/shops' ? 'bg-green-600 text-white' : 'text-gray-300 hover:bg-gray-800'}`}
          >
            <Store className="w-5 h-5 mr-3" /> Manage Shops
          </Link>
          <Link 
            to="/admin/products" 
            className={`flex items-center px-4 py-3 rounded-lg transition-colors ${location.pathname === '/admin/products' ? 'bg-green-600 text-white' : 'text-gray-300 hover:bg-gray-800'}`}
          >
            <Shield className="w-5 h-5 mr-3" /> Manage Products
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button onClick={handleLogout} className="flex w-full items-center px-4 py-3 text-red-400 hover:bg-gray-800 rounded-lg transition-colors">
            <LogOut className="w-5 h-5 mr-3" /> Sign Out
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
