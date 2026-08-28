import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Package, Search, CheckCircle2, XCircle } from 'lucide-react';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/admin/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleProductStatus = async (productId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      const response = await api.patch(`/admin/products/${productId}/status?status=${newStatus}`);
      setProducts(products.map(p => p.id === productId ? { ...p, status: response.data.status } : p));
    } catch (error) {
      alert(error.response?.data?.detail || 'Failed to update product status');
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return <div className="text-center py-10">Loading products...</div>;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Product Management</h1>
        
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
              <th className="px-6 py-4 font-medium">Product</th>
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-6 py-4 font-medium">Price</th>
              <th className="px-6 py-4 font-medium text-center">Status</th>
              <th className="px-6 py-4 font-medium text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <Package className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{product.name}</div>
                      <div className="text-xs text-gray-500">ID: {product.id} | Shop ID: {product.shop_id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {product.category || '-'}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  ₹{product.price}
                </td>
                <td className="px-6 py-4 text-center">
                  {product.status === 'ACTIVE' ? (
                    <span className="inline-flex items-center gap-1 text-green-600 text-sm font-medium">
                      <CheckCircle2 className="w-4 h-4" /> Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-red-600 text-sm font-medium">
                      <XCircle className="w-4 h-4" /> Deactivated
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => toggleProductStatus(product.id, product.status)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      product.status === 'ACTIVE' 
                      ? 'text-red-600 hover:bg-red-50' 
                      : 'text-green-600 hover:bg-green-50'
                    }`}
                  >
                    {product.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
