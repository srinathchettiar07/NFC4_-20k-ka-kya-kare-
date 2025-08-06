import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/AuthStore.js';
import { useBlockchain } from '../components/BlockchainProvider.jsx';
import Navbar from '../components/ui/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

const Dashboard = () => {
  const { logout } = useAuthStore();
  const {
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
    clearError
  } = useBlockchain();

  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [formData, setFormData] = useState({
    location: '',
    metadataURI: '',
    priceInEth: ''
  });

  const handleConnect = async () => {
    try {
      await connect();
      setShowConnectModal(false);
    } catch (error) {
      console.error('Connection failed:', error);
    }
  };

  const handleRegisterProperty = async (e) => {
    e.preventDefault();
    try {
      await registerProperty(formData.location, formData.metadataURI, formData.priceInEth);
      setShowRegisterModal(false);
      setFormData({ location: '', metadataURI: '', priceInEth: '' });
    } catch (error) {
      console.error('Property registration failed:', error);
    }
  };

  const handlePurchase = async (propertyId, priceInEth) => {
    try {
      await completePurchase(propertyId, priceInEth);
      setShowPurchaseModal(false);
      setSelectedProperty(null);
    } catch (error) {
      console.error('Purchase failed:', error);
    }
  };

  const handleApprove = async (propertyId, approval) => {
    try {
      await approvePurchase(propertyId, approval);
    } catch (error) {
      console.error('Approval failed:', error);
    }
  };

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatPrice = (price) => {
    return `${parseFloat(price).toFixed(4)} ETH`;
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Blockchain Dashboard
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Manage your properties and interact with the blockchain
            </p>
          </div>

          {/* Connection Status */}
          <div className="mb-8">
            <Card className="bg-white/5 backdrop-blur-lg border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Wallet Connection</CardTitle>
              </CardHeader>
              <CardContent>
                {!isConnected ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-300">Not connected to MetaMask</p>
                      <p className="text-sm text-gray-400">Connect your wallet to interact with the blockchain</p>
                    </div>
                    <Button 
                      onClick={handleConnect}
                      disabled={loading}
                      className="bg-yellow-500 hover:bg-yellow-600 text-black"
                    >
                      {loading ? 'Connecting...' : 'Connect Wallet'}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-400 font-semibold">Connected</p>
                        <p className="text-gray-300">Account: {formatAddress(account)}</p>
                        {networkInfo && (
                          <p className="text-gray-400">
                            Network: {networkInfo.name} | Balance: {parseFloat(networkInfo.balance).toFixed(4)} ETH
                          </p>
                        )}
                      </div>
                      <Button 
                        onClick={logout}
                        variant="outline"
                        className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                      >
                        Logout
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-8 bg-red-500/20 border border-red-500/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <p className="text-red-400 font-semibold">{error}</p>
                <Button onClick={clearError} variant="ghost" className="text-red-400">
                  ×
                </Button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {isConnected && (
            <div className="mb-8 flex flex-wrap gap-4">
              <Button 
                onClick={() => setShowRegisterModal(true)}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                Register New Property
              </Button>
              <Button 
                onClick={() => window.location.href = '/addproperty'}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Add Property (Traditional)
              </Button>
            </div>
          )}

          {/* Properties Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* User Properties */}
            <Card className="bg-white/5 backdrop-blur-lg border-white/10">
              <CardHeader>
                <CardTitle className="text-white">My Properties ({userProperties.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {userProperties.length === 0 ? (
                  <p className="text-gray-400">No properties owned</p>
                ) : (
                  <div className="space-y-4">
                    {userProperties.map((property) => (
                      <div key={property.id} className="p-4 bg-white/10 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-white font-semibold">Property #{property.id}</h4>
                          <Badge variant={property.isForSale ? "default" : "secondary"}>
                            {property.isForSale ? 'For Sale' : 'Not Listed'}
                          </Badge>
                        </div>
                        <p className="text-gray-300 text-sm mb-2">{property.location}</p>
                        <p className="text-yellow-400 font-semibold">{formatPrice(property.price)}</p>
                        <div className="mt-3 space-y-2">
                          <Button 
                            size="sm"
                            onClick={() => updateListing(property.id, property.price, !property.isForSale)}
                            className="w-full"
                          >
                            {property.isForSale ? 'Remove from Sale' : 'List for Sale'}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Properties for Sale */}
            <Card className="bg-white/5 backdrop-blur-lg border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Properties for Sale ({propertiesForSale.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {propertiesForSale.length === 0 ? (
                  <p className="text-gray-400">No properties available for purchase</p>
                ) : (
                  <div className="space-y-4">
                    {propertiesForSale.map((property) => (
                      <div key={property.id} className="p-4 bg-white/10 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-white font-semibold">Property #{property.id}</h4>
                          <Badge variant="default">For Sale</Badge>
                        </div>
                        <p className="text-gray-300 text-sm mb-2">{property.location}</p>
                        <p className="text-yellow-400 font-semibold">{formatPrice(property.price)}</p>
                        <p className="text-gray-400 text-xs mb-3">
                          Owner: {formatAddress(property.owner)}
                        </p>
                        <div className="space-y-2">
                          <Button 
                            size="sm"
                            onClick={() => {
                              setSelectedProperty(property);
                              setShowPurchaseModal(true);
                            }}
                            className="w-full bg-green-500 hover:bg-green-600"
                          >
                            Purchase Property
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => handleApprove(property.id, true)}
                            variant="outline"
                            className="w-full"
                          >
                            Approve Purchase
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* All Properties */}
            <Card className="bg-white/5 backdrop-blur-lg border-white/10">
              <CardHeader>
                <CardTitle className="text-white">All Properties ({properties.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {properties.length === 0 ? (
                  <p className="text-gray-400">No properties registered</p>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {properties.map((property) => (
                      <div key={property.id} className="p-4 bg-white/10 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-white font-semibold">Property #{property.id}</h4>
                          <div className="flex gap-1">
                            {property.isForSale && <Badge variant="default">Sale</Badge>}
                            {property.aiApproved && <Badge variant="secondary">AI Approved</Badge>}
                            {property.buyerApproved && <Badge variant="secondary">Buyer Approved</Badge>}
                            {property.sellerApproved && <Badge variant="secondary">Seller Approved</Badge>}
                          </div>
                        </div>
                        <p className="text-gray-300 text-sm mb-2">{property.location}</p>
                        <p className="text-yellow-400 font-semibold">{formatPrice(property.price)}</p>
                        <p className="text-gray-400 text-xs">
                          Owner: {formatAddress(property.owner)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Register Property Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold text-white mb-4">Register New Property</h3>
            <form onSubmit={handleRegisterProperty} className="space-y-4">
              <div>
                <label className="block text-white mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600"
                  placeholder="123 Main St, City, State"
                  required
                />
              </div>
              <div>
                <label className="block text-white mb-2">Metadata URI</label>
                <input
                  type="text"
                  value={formData.metadataURI}
                  onChange={(e) => setFormData({...formData, metadataURI: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600"
                  placeholder="ipfs://..."
                  required
                />
              </div>
              <div>
                <label className="block text-white mb-2">Price (ETH)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.priceInEth}
                  onChange={(e) => setFormData({...formData, priceInEth: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600"
                  placeholder="0.5"
                  required
                />
              </div>
              <div className="flex gap-4">
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1 bg-green-500 hover:bg-green-600"
                >
                  {loading ? 'Registering...' : 'Register Property'}
                </Button>
                <Button 
                  type="button" 
                  onClick={() => setShowRegisterModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Purchase Property Modal */}
      {showPurchaseModal && selectedProperty && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold text-white mb-4">Purchase Property</h3>
            <div className="space-y-4">
              <div>
                <p className="text-gray-300">Property #{selectedProperty.id}</p>
                <p className="text-white font-semibold">{selectedProperty.location}</p>
                <p className="text-yellow-400 font-bold">{formatPrice(selectedProperty.price)}</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-300">AI Approved:</span>
                  <Badge variant={selectedProperty.aiApproved ? "default" : "secondary"}>
                    {selectedProperty.aiApproved ? 'Yes' : 'No'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Buyer Approved:</span>
                  <Badge variant={selectedProperty.buyerApproved ? "default" : "secondary"}>
                    {selectedProperty.buyerApproved ? 'Yes' : 'No'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Seller Approved:</span>
                  <Badge variant={selectedProperty.sellerApproved ? "default" : "secondary"}>
                    {selectedProperty.sellerApproved ? 'Yes' : 'No'}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-4">
                <Button 
                  onClick={() => handlePurchase(selectedProperty.id, selectedProperty.price)}
                  disabled={loading || !selectedProperty.aiApproved || !selectedProperty.buyerApproved || !selectedProperty.sellerApproved}
                  className="flex-1 bg-green-500 hover:bg-green-600"
                >
                  {loading ? 'Processing...' : 'Complete Purchase'}
                </Button>
                <Button 
                  onClick={() => setShowPurchaseModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
