import React, { useEffect, useState } from 'react';
import UploadDocument from "../components/UploadDocuments.jsx";
import DocumentList from "../components/DocumentList.jsx";
import { getAllDocuments } from "../lib/api.js";
import { getContract } from '../lib/blockchain.js';

const Document = () => {
  const [documents, setDocuments] = useState([]);
  const [contract, setContract] = useState(null);
  const [propertyCount, setPropertyCount] = useState(0);
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState(null);

  const fetchDocuments = async () => {
    try {
      const res = await getAllDocuments();
      setDocuments(res.data || []);
    } catch (err) {
      console.error('Failed to fetch documents:', err);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  useEffect(() => {
    async function init() {
      try {
        const contractInstance = await getContract();
        setContract(contractInstance);
        const count = await contractInstance.propertyCount();
        setPropertyCount(count.toNumber());

        const props = [];
        for (let i = 1; i <= count; i++) {
          const prop = await contractInstance.getPropertyDetails(i);
          props.push({
            id: i,
            owner: prop.owner,
            location: prop.location,
            price: prop.price.toString(),
            isForSale: prop.isForSale,
            aiApproved: prop.aiApproved,
            buyerApproved: prop.buyerApproved,
            sellerApproved: prop.sellerApproved,
          });
        }
        setProperties(props);
      } catch (err) {
        setError(err.message);
      }
    }
    init();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">IPFS Document Manager</h1>
      <UploadDocument onUploadSuccess={fetchDocuments} />
      <DocumentList documents={documents} />

      <hr className="my-8" />

      <h2 className="text-xl font-semibold mb-4">Blockchain Properties</h2>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <p>Total Properties: {propertyCount}</p>
      <ul>
        {properties.map((property) => (
          <li key={property.id} className="mb-4 p-4 border rounded bg-white">
            <strong>ID:</strong> {property.id} <br />
            <strong>Owner:</strong> {property.owner} <br />
            <strong>Location:</strong> {property.location} <br />
            <strong>Price (Wei):</strong> {property.price} <br />
            <strong>For Sale:</strong> {property.isForSale ? 'Yes' : 'No'} <br />
            <strong>AI Approved:</strong> {property.aiApproved ? 'Yes' : 'No'} <br />
            <strong>Buyer Approved:</strong> {property.buyerApproved ? 'Yes' : 'No'} <br />
            <strong>Seller Approved:</strong> {property.sellerApproved ? 'Yes' : 'No'} <br />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Document;
