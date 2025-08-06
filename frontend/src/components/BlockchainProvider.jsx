import React, { createContext, useContext, useState, useEffect } from 'react';
import blockchainService from '../lib/blockchain';

const BlockchainContext = createContext();

export const useBlockchain = () => {
  const context = useContext(BlockchainContext);
  if (!context) {
    throw new Error('useBlockchain must be used within a BlockchainProvider');
  }
  return context;
};

export const BlockchainProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState(null);
  const [networkInfo, setNetworkInfo] = useState(null);
  const [properties, setProperties] = useState([]);
  const [userProperties, setUserProperties] = useState([]);
  const [propertiesForSale, setPropertiesForSale] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Connect to blockchain
  const connect = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await blockchainService.connect();
      setIsConnected(true);
      setAccount(result.account);
      
      // Get network info
      const network = await blockchainService.getNetworkInfo();
      setNetworkInfo(network);
      
      // Load properties
      await loadProperties();
      
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Load all properties
  const loadProperties = async () => {
    try {
      const allProperties = await blockchainService.getAllProperties();
      setProperties(allProperties);
      
      const userProps = await blockchainService.getUserProperties();
      setUserProperties(userProps);
      
      const forSaleProps = await blockchainService.getPropertiesForSale();
      setPropertiesForSale(forSaleProps);
    } catch (error) {
      console.error('Error loading properties:', error);
      setError('Failed to load properties');
    }
  };

  // Register a new property
  const registerProperty = async (location, metadataURI, priceInEth) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await blockchainService.registerProperty(location, metadataURI, priceInEth);
      
      // Reload properties after registration
      await loadProperties();
      
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update property listing
  const updateListing = async (propertyId, newPriceInEth, listForSale) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await blockchainService.updateListing(propertyId, newPriceInEth, listForSale);
      
      // Reload properties after update
      await loadProperties();
      
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Approve purchase
  const approvePurchase = async (propertyId, approval) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await blockchainService.approvePurchase(propertyId, approval);
      
      // Reload properties after approval
      await loadProperties();
      
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Complete purchase
  const completePurchase = async (propertyId, priceInEth) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await blockchainService.completePurchase(propertyId, priceInEth);
      
      // Reload properties after purchase
      await loadProperties();
      
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get property details
  const getPropertyDetails = async (propertyId) => {
    try {
      return await blockchainService.getPropertyDetails(propertyId);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Check connection status on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const connected = await blockchainService.isConnected();
        setIsConnected(connected);
        
        if (connected) {
          const account = await blockchainService.getAccount();
          setAccount(account);
          
          const network = await blockchainService.getNetworkInfo();
          setNetworkInfo(network);
          
          await loadProperties();
        }
      } catch (error) {
        console.error('Error checking connection:', error);
      }
    };

    checkConnection();
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          setIsConnected(false);
          setAccount(null);
          setProperties([]);
          setUserProperties([]);
          setPropertiesForSale([]);
        } else {
          setAccount(accounts[0]);
          loadProperties();
        }
      };

      const handleChainChanged = () => {
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  const value = {
    isConnected,
    account,
    networkInfo,
    properties,
    userProperties,
    propertiesForSale,
    loading,
    error,
    connect,
    registerProperty,
    updateListing,
    approvePurchase,
    completePurchase,
    getPropertyDetails,
    loadProperties,
    clearError: () => setError(null)
  };

  return (
    <BlockchainContext.Provider value={value}>
      {children}
    </BlockchainContext.Provider>
  );
}; 