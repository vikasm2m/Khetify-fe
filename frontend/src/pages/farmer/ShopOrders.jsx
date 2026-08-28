import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Package, Clock } from 'lucide-react';

export default function ShopOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/farmer/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch shop orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.patch(`/farmer/orders/${orderId}/status`, { status: newStatus });
      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error('Failed to update order status:', error);
      alert('Failed to update status');
    }
  };

  if (loading) {
    return <div className="text-center p-8 text-gray-500">Loading shop orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="text-center bg-white rounded-lg shadow-sm p-12 border border-gray-100">
        <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">No Orders Yet</h2>
        <p className="text-gray-500">When customers place orders from your shop, they will appear here.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Package className="w-6 h-6 text-green-600" />
        Shop Orders
      </h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order Details</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Items</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  {/* Order Details */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-semibold text-gray-900">#{order.id.toString().padStart(6, '0')}</div>
                    <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      {new Date(order.created_at).toLocaleString()}
                    </div>
                  </td>
                  
                  {/* Items List */}
                  <td className="px-6 py-4">
                    <ul className="text-sm space-y-1">
                      {order.items?.map(item => (
                        <li key={item.id} className="text-gray-700">
                          <span className="font-medium text-green-700">{item.quantity}x</span> {item.product_name}
                        </li>
                      ))}
                    </ul>
                  </td>
                  
                  {/* Total */}
                  <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900">
                    ₹{order.total_amount.toFixed(2)}
                  </td>
                  
                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                      order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  
                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="text-sm border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
