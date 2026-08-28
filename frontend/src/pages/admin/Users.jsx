import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { User, Shield, CheckCircle2, XCircle, Search } from 'lucide-react';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      const response = await api.patch(`/admin/users/${userId}/status?is_active=${!currentStatus}`);
      setUsers(users.map(u => u.id === userId ? { ...u, is_active: response.data.is_active } : u));
    } catch (error) {
      alert(error.response?.data?.detail || 'Failed to update user status');
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'ALL' || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  if (loading) return <div className="text-center py-10">Loading users...</div>;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <select 
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="ALL">All Roles</option>
            <option value="CUSTOMER">Customers</option>
            <option value="FARMER">Farmers</option>
            <option value="ADMIN">Admins</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
              <th className="px-6 py-4 font-medium">User</th>
              <th className="px-6 py-4 font-medium">Role</th>
              <th className="px-6 py-4 font-medium">Joined</th>
              <th className="px-6 py-4 font-medium text-center">Status</th>
              <th className="px-6 py-4 font-medium text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                      {user.role === 'ADMIN' ? <Shield className="w-5 h-5" /> : <User className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 
                      user.role === 'FARMER' ? 'bg-green-100 text-green-800' : 
                      'bg-blue-100 text-blue-800'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-center">
                  {user.is_active ? (
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
                  {user.role !== 'ADMIN' && (
                    <button
                      onClick={() => toggleUserStatus(user.id, user.is_active)}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        user.is_active 
                        ? 'text-red-600 hover:bg-red-50' 
                        : 'text-green-600 hover:bg-green-50'
                      }`}
                    >
                      {user.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                  No users found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
