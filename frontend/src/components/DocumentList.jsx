// src/components/DocumentList.jsx
import React from 'react';

const DocumentList = ({ documents }) => {
  if (documents.length === 0) {
    return <p className="text-gray-600">No documents uploaded yet.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {documents.map((doc) => (
        <div key={doc._id} className="border rounded p-3 shadow bg-white">
          <h2 className="text-sm font-semibold mb-2 truncate">{doc.name}</h2>
          <p className="text-xs text-gray-500">Type: {doc.type}</p>
          <p className="text-xs text-gray-500">Size: {(doc.size / 1024).toFixed(2)} KB</p>
          <a
            href={doc.ipfsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 text-sm mt-2 inline-block hover:underline"
          >
            View on IPFS
          </a>
          {doc.type.includes('image') && (
            <img
              src={doc.ipfsUrl}
              alt={doc.name}
              className="mt-2 w-full h-32 object-cover rounded"
            />
          )}
          {doc.type === 'application/pdf' && (
            <iframe
              src={doc.ipfsUrl}
              title={doc.name}
              className="mt-2 w-full h-40"
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default DocumentList;
