// src/components/UploadDocument.jsx
import React, { useState } from 'react';
import { uploadFile } from '../lib/api';

const UploadDocument = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return setMessage('Please select a file.');

    setLoading(true);
    try {
      await uploadFile(file);
      setMessage('Upload successful!');
      setFile(null);
      onUploadSuccess();
    } catch (err) {
      console.error(err);
      setMessage('Upload failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded shadow mb-4 bg-white">
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="block w-full mb-2"
      />
      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Uploading...' : 'Upload'}
      </button>
      {message && <p className="mt-2 text-sm text-gray-700">{message}</p>}
    </div>
  );
};

export default UploadDocument;
