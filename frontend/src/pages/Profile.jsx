import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, MapPin, Phone, Edit2, X, Check } from 'lucide-react';

export default function Profile() {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone_number: '', address: '' });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/auth/me');
      setProfile(response.data);
      setFormData({
        name: response.data.name || '',
        phone_number: response.data.phone_number || '',
        address: response.data.address || ''
      });
    } catch (error) {
      console.error('Failed to fetch profile', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put('/auth/me', formData);
      setProfile(response.data);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile', error);
      alert('Failed to update profile');
    }
  };

  if (loading) return <div className="text-center py-20">Loading profile...</div>;
  if (!profile) return <div className="text-center py-20 text-red-500">Failed to load profile.</div>;

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative">
        {/* Header Banner */}
        <div className="h-32 bg-gradient-to-r from-green-600 to-green-800 relative" />
        
        {/* Avatar */}
        <div className="absolute top-16 left-8">
          <div className="w-24 h-24 bg-white rounded-full p-1 shadow-md">
            <div className="w-full h-full bg-green-100 rounded-full flex items-center justify-center text-green-700">
              <User className="w-12 h-12" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            className="absolute top-36 right-6 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium text-sm transition-all shadow-sm flex items-center gap-2"
          >
            <Edit2 className="w-4 h-4" /> Edit Profile
          </button>
        ) : (
          <button 
            onClick={() => {
              setIsEditing(false);
              setFormData({
                name: profile.name || '',
                phone_number: profile.phone_number || '',
                address: profile.address || ''
              });
            }}
            className="absolute top-36 right-6 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 p-2 rounded-lg transition-all shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="pt-16 px-8 pb-8">
          {!isEditing ? (
            // VIEW MODE
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2">
                {profile.role}
              </span>

              <div className="mt-8 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email Address (Read-only)</p>
                    <p className="text-gray-900 font-medium mt-1">{profile.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Mobile Number</p>
                    <p className="text-gray-900 font-medium mt-1">{profile.phone_number || 'Not provided'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Delivery Address</p>
                    <p className="text-gray-900 font-medium mt-1">{profile.address || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // EDIT MODE
            <form onSubmit={handleSubmit} className="mt-4 space-y-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Edit Profile</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none" 
                  required 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={profile.email} 
                  disabled 
                  className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed" 
                />
                <p className="text-xs text-gray-500 mt-1">Email address cannot be changed.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                <input 
                  type="tel" 
                  value={formData.phone_number} 
                  onChange={(e) => setFormData({...formData, phone_number: e.target.value})} 
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none" 
                  placeholder="+91 9876543210"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
                <textarea 
                  value={formData.address} 
                  onChange={(e) => setFormData({...formData, address: e.target.value})} 
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none" 
                  rows="3"
                  placeholder="123 Farm Lane, Village..."
                ></textarea>
              </div>

              <div className="flex justify-end pt-4">
                <button 
                  type="submit" 
                  className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors shadow-sm flex items-center gap-2"
                >
                  <Check className="w-5 h-5" /> Save Changes
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
