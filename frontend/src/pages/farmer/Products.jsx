import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import ImageUploader from '../../components/ImageUploader';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [shop, setShop] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', category: '', description: '', price: '', available_quantity: '', image_url: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const shopRes = await api.get('/farmer/shop');
      setShop(shopRes.data);
      const prodRes = await api.get('/farmer/products');
      setProducts(prodRes.data);
    } catch (error) {
      console.error('Failed to fetch data', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/farmer/products/${editingId}`, formData);
      } else {
        await api.post('/farmer/products', formData);
      }
      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error('Failed to save product', error);
      alert('Failed to save product');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/farmer/products/${id}`);
        fetchData();
      } catch (error) {
        console.error('Failed to delete', error);
      }
    }
  };

  const openModal = (product = null) => {
    if (product) {
      setEditingId(product.id);
      setFormData(product);
    } else {
      setEditingId(null);
      setFormData({ name: '', category: '', description: '', price: '', available_quantity: '', image_url: '' });
    }
    setShowModal(true);
  };

  if (!shop) {
    return <div className="text-center p-8 bg-white rounded-lg shadow">Please create your shop first in the "My Shop" tab before adding products.</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Products</h1>
        <button onClick={() => openModal()} className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
          <Plus className="w-5 h-5 mr-2" /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-4 font-semibold text-gray-600">Name</th>
              <th className="p-4 font-semibold text-gray-600">Category</th>
              <th className="p-4 font-semibold text-gray-600">Price</th>
              <th className="p-4 font-semibold text-gray-600">Stock</th>
              <th className="p-4 font-semibold text-gray-600">Status</th>
              <th className="p-4 font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} className="border-b hover:bg-gray-50">
                <td className="p-4">{product.name}</td>
                <td className="p-4">{product.category}</td>
                <td className="p-4">₹{product.price}</td>
                <td className="p-4">{product.available_quantity}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${product.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {product.status}
                  </span>
                </td>
                <td className="p-4 flex gap-3">
                  <button onClick={() => openModal(product)} className="text-blue-600 hover:text-blue-800"><Pencil className="w-5 h-5" /></button>
                  <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-800"><Trash2 className="w-5 h-5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <div className="p-8 text-center text-gray-500">No products found. Start adding some!</div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Product' : 'Add Product'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700">Name</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="mt-1 p-2 w-full border rounded" required />
              </div>
              <div>
                <label className="block text-sm text-gray-700">Category</label>
                <input type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="mt-1 p-2 w-full border rounded" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700">Price (₹)</label>
                  <input type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="mt-1 p-2 w-full border rounded" required />
                </div>
                <div>
                  <label className="block text-sm text-gray-700">Stock Qty</label>
                  <input type="number" value={formData.available_quantity} onChange={e => setFormData({...formData, available_quantity: e.target.value})} className="mt-1 p-2 w-full border rounded" required />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-700">Description</label>
                <textarea value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="mt-1 p-2 w-full border rounded" rows="2"></textarea>
              </div>
              <div>
                <ImageUploader 
                  label="Product Image"
                  value={formData.image_url} 
                  onChange={(url) => setFormData({...formData, image_url: url})} 
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
