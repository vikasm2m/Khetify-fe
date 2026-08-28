import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { Search } from 'lucide-react';

export default function Shops() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await api.get('/shops');
        setShops(response.data);
      } catch (error) {
        console.error("Failed to fetch shops", error);
      } finally {
        setLoading(false);
      }
    };
    fetchShops();
  }, []);

  const filteredShops = shops.filter(shop => 
    shop.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (shop.description && shop.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return <div className="text-center py-20">Loading farmers...</div>;

  return (
    <div>
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Our Local Farmers</h1>
          <p className="text-gray-500 mt-2">Discover fresh products directly from local farms.</p>
        </div>
        
        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input 
            type="text" 
            placeholder="Search farms..." 
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredShops.map((shop) => (
          <Link key={shop.id} to={`/customer/shops/${shop.id}`} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all overflow-hidden border border-gray-100 flex flex-col">
            <div className="h-56 bg-gray-200 w-full overflow-hidden relative">
              <img src={shop.image_url || `https://ui-avatars.com/api/?name=${shop.name}&background=random&size=400`} alt={shop.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-xl font-bold text-white mb-1">{shop.name}</h3>
                <p className="text-gray-200 text-sm flex items-center gap-1">📍 {shop.address || 'Local Farm'}</p>
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <p className="text-gray-600 flex-1 leading-relaxed">{shop.description || 'Dedicated to bringing you the freshest and highest quality agricultural products.'}</p>
              <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="text-green-600 font-semibold group-hover:text-green-700">Explore Products →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {filteredShops.length === 0 && (
        <div className="text-center py-20">
          <p className="text-xl text-gray-500">No farms found matching your search.</p>
        </div>
      )}
    </div>
  );
}
