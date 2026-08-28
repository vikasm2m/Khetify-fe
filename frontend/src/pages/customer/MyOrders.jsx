import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Package, Clock, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders/');
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center p-8 text-gray-500">Loading your orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="text-center bg-white rounded-lg shadow-sm p-12 border border-gray-100">
        <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
          <ShoppingBag className="w-8 h-8 text-gray-400" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">No orders yet</h2>
        <p className="text-gray-500 mb-6">Looks like you haven't placed any orders.</p>
        <Link to="/customer/home" className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Package className="w-6 h-6 text-green-600" />
        My Orders
      </h1>
      
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white border rounded-xl shadow-sm overflow-hidden">
            {/* Order Header */}
            <div className="bg-gray-50 border-b px-6 py-4 flex flex-wrap justify-between items-center gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase">Order ID</p>
                <p className="font-semibold text-gray-900">#{order.id.toString().padStart(6, '0')}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase">Date Placed</p>
                <p className="font-semibold text-gray-900 flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase">Total Amount</p>
                <p className="font-bold text-green-700">₹{order.total_amount.toFixed(2)}</p>
              </div>
              <div className="text-right flex-1 sm:flex-none">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                  order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {order.status}
                </span>
              </div>
            </div>

            {/* Order Items */}
            <div className="px-6 py-4">
              <h4 className="text-sm font-semibold text-gray-800 mb-3 border-b pb-2">Items</h4>
              <ul className="space-y-3">
                {order.items?.map((item) => (
                  <li key={item.id} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-50 text-green-700 font-medium px-2 py-1 rounded-md text-xs">
                        {item.quantity}x
                      </div>
                      <span className="font-medium text-gray-700">{item.product_name}</span>
                    </div>
                    <div className="text-gray-600 font-medium">
                      ₹{item.subtotal.toFixed(2)}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
