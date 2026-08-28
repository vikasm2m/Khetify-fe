import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

export default function AdminShops() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      const response = await api.get('/admin/shops');
      setShops(response.data);
    } catch (error) {
      console.error('Failed to fetch shops', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/admin/shops/${id}/status?status=${status}`);
      fetchShops();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  if (loading) return <div>Loading shops...</div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Shop Management</h1>
        <p className="text-gray-600 mt-2">Approve, suspend, or manage farmer shops.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="p-4 font-semibold text-gray-600">ID</th>
              <th className="p-4 font-semibold text-gray-600">Shop Name</th>
              <th className="p-4 font-semibold text-gray-600">Farmer ID</th>
              <th className="p-4 font-semibold text-gray-600">Status</th>
              <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {shops.map(shop => (
              <tr key={shop.id} className="hover:bg-gray-50">
                <td className="p-4 text-gray-500">#{shop.id}</td>
                <td className="p-4 font-medium text-gray-900">{shop.name}</td>
                <td className="p-4 text-gray-600">User #{shop.farmer_id}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    shop.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                    shop.status === 'INACTIVE' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {shop.status}
                  </span>
                </td>
                <td className="p-4 flex justify-end gap-2">
                  {shop.status !== 'ACTIVE' && (
                    <button 
                      onClick={() => updateStatus(shop.id, 'ACTIVE')}
                      className="px-3 py-1 bg-green-100 text-green-700 hover:bg-green-200 rounded font-medium text-sm transition-colors"
                    >
                      Activate
                    </button>
                  )}
                  {shop.status !== 'INACTIVE' && (
                    <button 
                      onClick={() => updateStatus(shop.id, 'INACTIVE')}
                      className="px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded font-medium text-sm transition-colors"
                    >
                      Suspend
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {shops.length === 0 && (
          <div className="p-8 text-center text-gray-500">No shops found.</div>
        )}
      </div>
    </div>
  );
}
