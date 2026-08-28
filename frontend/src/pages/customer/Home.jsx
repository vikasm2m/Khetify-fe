import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

export default function CustomerHome() {
  const [shops, setShops] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [shopsRes, productsRes] = await Promise.all([
          api.get('/shops'),
          api.get('/products')
        ]);
        setShops(shopsRes.data.slice(0, 4)); // Show top 4 shops
        setProducts(productsRes.data.slice(0, 8)); // Show top 8 products
      } catch (error) {
        console.error("Failed to fetch homepage data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center py-20">Loading fresh produce...</div>;
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="relative bg-green-700 rounded-2xl overflow-hidden shadow-xl">
        <div className="absolute inset-0">
          <img className="w-full h-full object-cover opacity-20" src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" alt="Farm field" />
          <div className="absolute inset-0 bg-green-900 mix-blend-multiply" />
        </div>
        <div className="relative px-8 py-16 sm:px-16 sm:py-24 lg:py-32 lg:px-24">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Fresh From Local Farmers
          </h1>
          <p className="mt-6 max-w-2xl text-xl text-green-100">
            FarmConnect brings the farmer's market to your doorstep. Support local agriculture and get the freshest produce directly from the source.
          </p>
          <div className="mt-10">
            <Link to="/customer/shops" className="inline-block bg-white border border-transparent rounded-md py-3 px-8 text-base font-medium text-green-700 hover:bg-green-50 shadow-md transition-colors">
              Browse Farmers
            </Link>
          </div>
        </div>
      </div>

      {/* Categories */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Vegetables 🥬', 'Fruits 🍎', 'Dairy 🥛', 'Grains 🌾'].map((cat, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 text-center border border-gray-100 cursor-pointer">
              <span className="text-xl font-medium text-gray-800">{cat}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Shops */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Featured Farmers</h2>
          <Link to="/customer/shops" className="text-green-600 hover:text-green-800 font-medium">View all →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {shops.map((shop) => (
            <Link key={shop.id} to={`/customer/shops/${shop.id}`} className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden border border-gray-100 flex flex-col">
              <div className="h-48 bg-gray-200 w-full overflow-hidden">
                <img src={shop.image_url || `https://ui-avatars.com/api/?name=${shop.name}&background=random&size=400`} alt={shop.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{shop.name}</h3>
                <p className="text-sm text-gray-500 flex-1">{shop.description?.substring(0, 80) || 'Local farm providing fresh products.'}...</p>
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-sm font-medium text-green-600">Visit Shop</span>
                  <span className="text-yellow-400">⭐⭐⭐⭐⭐</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Fresh Products */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Fresh Arrivals</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link key={product.id} to={`/customer/products/${product.id}`} className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden border border-gray-100 flex flex-col">
              <div className="h-48 bg-gray-100 w-full overflow-hidden p-4">
                <img src={product.image_url || `https://ui-avatars.com/api/?name=${product.name}&background=random&size=400`} alt={product.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 rounded-lg" />
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <span className="text-xs font-semibold tracking-wider text-green-600 uppercase mb-1">{product.category || 'Fresh'}</span>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>
                <div className="mt-auto flex justify-between items-end">
                  <span className="text-xl font-bold text-gray-900">₹{product.price}</span>
                  <button className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-full shadow-sm transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
