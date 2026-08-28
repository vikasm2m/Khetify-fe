import React, { useState } from 'react';
import axios from 'axios';
import api from '../api/axios';
import { UploadCloud, Image as ImageIcon, CheckCircle, Loader2 } from 'lucide-react';

export default function ImageUploader({ value, onChange, label = "Upload Image" }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      // 1. Get presigned URL from backend
      const presignedRes = await api.post('/upload/presigned-url', {
        filename: file.name,
        content_type: file.type
      });
      
      const { upload_url, public_url } = presignedRes.data;

      // 2. Upload directly to S3 using the presigned URL
      // We use raw axios here to avoid our custom interceptors sending JWTs to AWS
      await axios.put(upload_url, file, {
        headers: {
          'Content-Type': file.type
        }
      });

      // 3. Update the form with the final public URL
      onChange(public_url);
    } catch (err) {
      console.error('Upload failed', err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      
      <div className="flex items-center gap-4">
        {/* Preview Area */}
        <div className="w-24 h-24 flex-shrink-0 bg-gray-100 border border-gray-200 rounded-lg overflow-hidden flex items-center justify-center relative">
          {value ? (
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="w-8 h-8 text-gray-400" />
          )}
          {uploading && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-green-600 animate-spin" />
            </div>
          )}
        </div>

        {/* Upload Controls */}
        <div className="flex-1">
          <div className="relative">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              disabled={uploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            />
            <button 
              type="button" 
              disabled={uploading}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              <UploadCloud className="w-4 h-4" />
              {uploading ? 'Uploading...' : 'Choose Image'}
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-500">PNG, JPG up to 5MB.</p>
          {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
          {value && !uploading && !error && (
             <p className="mt-1 text-xs text-green-600 flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Upload successful</p>
          )}
        </div>
      </div>
    </div>
  );
}
