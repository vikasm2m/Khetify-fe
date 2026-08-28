import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const role = await login(email, password);
      if (role === 'CUSTOMER') navigate('/customer/home');
      else if (role === 'FARMER') navigate('/farmer/dashboard');
      else if (role === 'ADMIN') navigate('/admin/dashboard');
    } catch (error) {
      console.error('Login failed', error);
      setErrorMsg(error.response?.data?.detail || 'An unexpected error occurred during login.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="p-8 bg-white shadow rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-green-700">FarmConnect Login</h2>
        
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
            {errorMsg}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 p-2 w-full border rounded" required />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 p-2 w-full border rounded" required />
        </div>
        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 mb-4">Login</button>
        <div className="text-center text-sm">
          Don't have an account? <a href="/register" className="text-green-600 hover:underline">Register here</a>
        </div>
      </form>
    </div>
  );
}
