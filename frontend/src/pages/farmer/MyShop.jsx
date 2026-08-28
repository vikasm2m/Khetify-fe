import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import ImageUploader from '../../components/ImageUploader';
import { Edit2, MapPin, X } from 'lucide-react';

export default function MyShop() {
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', address: '', image_url: '' });

  useEffect(() => {
    fetchShop();
  }, []);

  const fetchShop = async () => {
    try {
      const response = await api.get('/farmer/shop');
      setShop(response.data);
      setFormData(response.data);
    } catch (error) {
      if (error.response?.status !== 404) {
        console.error('Failed to fetch shop', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (shop) {
        await api.put('/farmer/shop', formData);
        alert('Shop updated successfully!');
      } else {
        const response = await api.post('/farmer/shop', formData);
        setShop(response.data);
        alert('Shop created successfully!');
      }
      setIsEditing(false); // Return to view mode after saving
    } catch (error) {
      console.error('Failed to save shop', error);
      alert('Failed to save shop');
    }
  };

  if (loading) return <div className="text-center py-10">Loading shop data...</div>;

  // READ-ONLY PROFILE VIEW
  if (shop && !isEditing) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-72 bg-green-900 relative w-full overflow-hidden">
           <img 
             src={shop.image_url || `https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80`} 
             alt="Shop Cover" 
             className="w-full h-full object-cover opacity-60" 
           />
           <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
           
           {/* Edit Button */}
           <button 
             onClick={() => setIsEditing(true)}
             className="absolute top-6 right-6 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white p-3 rounded-full transition-all shadow-sm"
             title="Edit Shop Profile"
           >
             <Edit2 className="w-5 h-5" />
           </button>

           <div className="absolute bottom-8 left-8 right-8 text-white">
             <h1 className="text-4xl font-bold mb-3">{shop.name}</h1>
             <p className="text-lg text-gray-200 mb-5 max-w-3xl leading-relaxed">
               {shop.description || 'No description provided.'}
             </p>
             <div className="inline-flex items-center px-4 py-2 rounded-full bg-black/30 backdrop-blur-sm text-sm font-medium border border-white/10">
               <MapPin className="w-4 h-4 mr-2 text-green-400" /> 
               {shop.address || 'Address not provided'}
             </div>
           </div>
        </div>
      </div>
    );
  }

  // EDIT / CREATE FORM
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-8 relative">
      {shop && (
        <button 
          onClick={() => {
            setIsEditing(false);
            setFormData(shop); // Reset to original data
          }}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      )}
      
      <h1 className="text-2xl font-bold mb-8 text-gray-800">{shop ? 'Edit Shop Profile' : 'Create Your Shop'}</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Shop Name</label>
          <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none" required />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea value={formData.description || ''} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none" rows="4"></textarea>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <input type="text" value={formData.address || ''} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none" />
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300">
          <ImageUploader 
            label="Shop Banner Image"
            value={formData.image_url} 
            onChange={(url) => setFormData({...formData, image_url: url})} 
          />
        </div>
        
        <button type="submit" className="w-full bg-green-600 text-white p-3 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-sm mt-4">
          {shop ? 'Save Changes' : 'Create Shop'}
        </button>
      </form>
    </div>
  );
}
