import React, { useContext } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import { Search, ShoppingCart, User, LogOut, Package } from 'lucide-react';

export default function CustomerLayout() {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname.includes(path);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const cartItemCount = cart?.items?.length || 0;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/customer/home" className="text-2xl font-bold text-green-700 flex items-center gap-2">
                🌾 FarmConnect
              </Link>
            </div>

            {/* Navigation & Search */}
            <div className="flex-1 flex justify-center px-2 lg:ml-6 lg:justify-end">
              <div className="max-w-lg w-full lg:max-w-xs">
                <label htmlFor="search" className="sr-only">Search</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input id="search" name="search" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm transition duration-150 ease-in-out" placeholder="Search fresh products..." type="search" />
                </div>
              </div>
            </div>

            {/* Icons */}
            <div className="flex items-center gap-4 ml-6">
              <Link to="/customer/shops" className={`font-medium hidden md:block transition-colors ${isActive('/customer/shops') ? 'text-green-700' : 'text-gray-600 hover:text-green-600'}`}>All Shops</Link>
              
              <Link to="/customer/cart" className={`relative p-2 transition-colors ${isActive('/customer/cart') ? 'text-green-700' : 'text-gray-600 hover:text-green-600'}`}>
                <ShoppingCart className="h-6 w-6" />
                {cartItemCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              <div className="relative group">
                <button className="flex items-center gap-2 text-gray-600 hover:text-green-600 p-2">
                  <User className="h-6 w-6" />
                  <span className="hidden md:block font-medium">{user?.email?.split('@')[0] || 'Profile'}</span>
                </button>
                <div className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <Link to="/customer/profile" className={`flex px-4 py-2 text-sm w-full text-left transition-colors ${isActive('/customer/profile') ? 'bg-green-50 text-green-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}>
                    <User className="h-4 w-4 mr-2" /> My Profile
                  </Link>
                  <Link to="/customer/orders" className={`flex px-4 py-2 text-sm w-full text-left transition-colors ${isActive('/customer/orders') ? 'bg-green-50 text-green-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}>
                    <Package className="h-4 w-4 mr-2" /> My Orders
                  </Link>
                  <button onClick={handleLogout} className="flex px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left">
                    <LogOut className="h-4 w-4 mr-2" /> Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} FarmConnect. Supporting local farmers.
          </p>
        </div>
      </footer>
    </div>
  );
}
