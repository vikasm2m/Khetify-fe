import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { ShoppingCart, DollarSign, TrendingUp, Package, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FarmerDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/farmer/dashboard-stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard stats', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-10 h-10 text-green-600 animate-spin" />
      </div>
    );
  }

  // If no stats are available, it implies they probably haven't set up a shop
  if (!stats) {
    return (
      <div className="p-8 text-center bg-white rounded-xl shadow-sm border border-gray-100 max-w-2xl mx-auto mt-12">
        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to FarmConnect</h2>
        <p className="text-gray-500 mb-6">Create your shop to start receiving orders and tracking your earnings.</p>
        <Link to="/farmer/shop" className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition">
          Set up my shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Here is what's happening with your farm business today.</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center">
          <div className="p-4 rounded-full bg-blue-50 text-blue-600 mr-4">
            <ShoppingCart className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Orders</p>
            <p className="text-3xl font-bold text-gray-900">{stats.total_orders}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center">
          <div className="p-4 rounded-full bg-green-50 text-green-600 mr-4">
            <DollarSign className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Earnings</p>
            <p className="text-3xl font-bold text-gray-900">₹{stats.total_earnings.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center">
          <div className="p-4 rounded-full bg-purple-50 text-purple-600 mr-4">
            <TrendingUp className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Annual Income</p>
            <p className="text-3xl font-bold text-gray-900">₹{stats.annual_income.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Earnings Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-6">Monthly Revenue ({new Date().getFullYear()})</h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.monthly_data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dx={-10} tickFormatter={(val) => `₹${val}`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value) => [`₹${value}`, "Revenue"]}
                />
                <Area type="monotone" dataKey="earnings" stroke="#16a34a" strokeWidth={3} fillOpacity={1} fill="url(#colorEarnings)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Orders Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-6">Orders Volume ({new Date().getFullYear()})</h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.monthly_data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} barSize={30}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dx={-10} />
                <Tooltip 
                  cursor={{ fill: '#f3f4f6' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value) => [value, "Orders"]}
                />
                <Bar dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
