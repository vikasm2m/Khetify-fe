import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('CUSTOMER');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const loggedInRole = await register(name, email, password, role);
      if (loggedInRole === 'CUSTOMER') navigate('/customer/home');
      else if (loggedInRole === 'FARMER') navigate('/farmer/dashboard');
      else if (loggedInRole === 'ADMIN') navigate('/admin/dashboard');
    } catch (error) {
      console.error('Registration failed', error);
      alert('Registration failed. Email might already exist.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="p-8 bg-white shadow rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-green-700">Join FarmConnect</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 p-2 w-full border rounded" required />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 p-2 w-full border rounded" required />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 p-2 w-full border rounded" required />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">I am a...</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} className="mt-1 p-2 w-full border rounded" required>
            <option value="CUSTOMER">Customer (Buy Products)</option>
            <option value="FARMER">Farmer (Sell Products)</option>
          </select>
        </div>

        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 mb-4">Register</button>
        <div className="text-center text-sm">
            Already have an account? <Link to="/login" className="text-green-600 hover:underline">Login</Link>
        </div>
      </form>
    </div>
  );
}
