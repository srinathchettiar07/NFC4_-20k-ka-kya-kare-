import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';

// Contract configuration
const CONTRACT_ADDRESS = '0x0C9D51c658908a362739B37F12548856eF8C231C';
const CONTRACT_ABI = [
  {
    "inputs": [{"internalType": "address", "name": "_aiValidator", "type": "address"}],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": false, "internalType": "uint256", "name": "id", "type": "uint256"},
      {"indexed": false, "internalType": "address", "name": "by", "type": "address"},
      {"indexed": false, "internalType": "bool", "name": "isAI", "type": "bool"}
    ],
    "name": "ApprovalGiven",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": false, "internalType": "uint256", "name": "id", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "newPrice", "type": "uint256"}
    ],
    "name": "PropertyListed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": false, "internalType": "uint256", "name": "id", "type": "uint256"},
      {"indexed": false, "internalType": "address", "name": "owner", "type": "address"},
      {"indexed": false, "internalType": "string", "name": "location", "type": "string"},
      {"indexed": false, "internalType": "string", "name": "metadataURI", "type": "string"},
      {"indexed": false, "internalType": "uint256", "name": "price", "type": "uint256"}
    ],
    "name": "PropertyRegistered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": false, "internalType": "uint256", "name": "id", "type": "uint256"},
      {"indexed": false, "internalType": "address", "name": "from", "type": "address"},
      {"indexed": false, "internalType": "address", "name": "to", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "price", "type": "uint256"}
    ],
    "name": "PropertyTransferred",
    "type": "event"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_propertyId", "type": "uint256"}],
    "name": "aiApprove",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_propertyId", "type": "uint256"}],
    "name": "approvePurchase",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_propertyId", "type": "uint256"}],
    "name": "completePurchase",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_propertyId", "type": "uint256"}],
    "name": "getPropertyDetails",
    "outputs": [
      {"internalType": "address", "name": "owner", "type": "address"},
      {"internalType": "string", "name": "location", "type": "string"},
      {"internalType": "uint256", "name": "price", "type": "uint256"},
      {"internalType": "bool", "name": "isForSale", "type": "bool"},
      {"internalType": "bool", "name": "aiApproved", "type": "bool"},
      {"internalType": "bool", "name": "buyerApproved", "type": "bool"},
      {"internalType": "bool", "name": "sellerApproved", "type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "name": "properties",
    "outputs": [
      {"internalType": "address", "name": "owner", "type": "address"},
      {"internalType": "string", "name": "location", "type": "string"},
      {"internalType": "uint256", "name": "price", "type": "uint256"},
      {"internalType": "bool", "name": "isForSale", "type": "bool"},
      {"internalType": "bool", "name": "aiApproved", "type": "bool"},
      {"internalType": "bool", "name": "sellerApproved", "type": "bool"},
      {"internalType": "bool", "name": "buyerApproved", "type": "bool"},
      {"internalType": "string", "name": "metadataURI", "type": "string"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "propertyCount",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "string", "name": "_location", "type": "string"},
      {"internalType": "string", "name": "_metadataURI", "type": "string"},
      {"internalType": "uint256", "name": "_priceInWei", "type": "uint256"}
    ],
    "name": "registerProperty",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "_propertyId", "type": "uint256"},
      {"internalType": "uint256", "name": "_newPriceInWei", "type": "uint256"},
      {"internalType": "bool", "name": "_listForSale", "type": "bool"}
    ],
    "name": "updateListing",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

class BlockchainService {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.account = null;
  }

  async connect() {
    try {
      // Detect MetaMask provider
      const provider = await detectEthereumProvider();
      
      if (!provider) {
        throw new Error('MetaMask is not installed. Please install MetaMask to use this application.');
      }

      // Request account access
      const accounts = await provider.request({ method: 'eth_requestAccounts' });
      this.account = accounts[0];

      // Create ethers provider and signer
      this.provider = new ethers.providers.Web3Provider(provider);
      this.signer = this.provider.getSigner();
      
      // Create contract instance
      this.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.signer);

      return {
        success: true,
        account: this.account,
        network: await this.provider.getNetwork()
      };
    } catch (error) {
      console.error('Connection error:', error);
      throw error;
    }
  }

  async getAccount() {
    if (!this.account) {
      await this.connect();
    }
    return this.account;
  }

  async getContract() {
    if (!this.contract) {
      await this.connect();
    }
    return this.contract;
  }

  // Convert ETH to Wei
  ethToWei(ethAmount) {
    return ethers.utils.parseEther(ethAmount.toString());
  }

  // Convert Wei to ETH
  weiToEth(weiAmount) {
    return ethers.utils.formatEther(weiAmount);
  }

  // Register a new property
  async registerProperty(location, metadataURI, priceInEth) {
    try {
      const contract = await this.getContract();
      const priceInWei = this.ethToWei(priceInEth);
      
      const tx = await contract.registerProperty(location, metadataURI, priceInWei);
      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: receipt.transactionHash,
        gasUsed: receipt.gasUsed.toString(),
        events: receipt.events
      };
    } catch (error) {
      console.error('Property registration error:', error);
      throw error;
    }
  }

  // Update property listing
  async updateListing(propertyId, newPriceInEth, listForSale) {
    try {
      const contract = await this.getContract();
      const newPriceInWei = this.ethToWei(newPriceInEth);
      
      const tx = await contract.updateListing(propertyId, newPriceInWei, listForSale);
      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: receipt.transactionHash,
        gasUsed: receipt.gasUsed.toString()
      };
    } catch (error) {
      console.error('Update listing error:', error);
      throw error;
    }
  }

  // Approve purchase (buyer or seller)
  async approvePurchase(propertyId, approval) {
    try {
      const contract = await this.getContract();
      
      const tx = await contract.approvePurchase(propertyId, approval);
      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: receipt.transactionHash,
        gasUsed: receipt.gasUsed.toString()
      };
    } catch (error) {
      console.error('Purchase approval error:', error);
      throw error;
    }
  }

  // Complete property purchase
  async completePurchase(propertyId, priceInEth) {
    try {
      const contract = await this.getContract();
      const priceInWei = this.ethToWei(priceInEth);
      
      const tx = await contract.completePurchase(propertyId, { value: priceInWei });
      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: receipt.transactionHash,
        gasUsed: receipt.gasUsed.toString()
      };
    } catch (error) {
      console.error('Purchase completion error:', error);
      throw error;
    }
  }

  // Get property details
  async getPropertyDetails(propertyId) {
    try {
      const contract = await this.getContract();
      const details = await contract.getPropertyDetails(propertyId);
      
      return {
        owner: details.owner,
        location: details.location,
        price: this.weiToEth(details.price),
        priceWei: details.price.toString(),
        isForSale: details.isForSale,
        aiApproved: details.aiApproved,
        buyerApproved: details.buyerApproved,
        sellerApproved: details.sellerApproved
      };
    } catch (error) {
      console.error('Get property details error:', error);
      throw error;
    }
  }

  // Get all properties
  async getAllProperties() {
    try {
      const contract = await this.getContract();
      const propertyCount = await contract.propertyCount();
      const properties = [];

      for (let i = 1; i <= propertyCount; i++) {
        try {
          const details = await contract.getPropertyDetails(i);
          properties.push({
            id: i,
            owner: details.owner,
            location: details.location,
            price: this.weiToEth(details.price),
            priceWei: details.price.toString(),
            isForSale: details.isForSale,
            aiApproved: details.aiApproved,
            buyerApproved: details.buyerApproved,
            sellerApproved: details.sellerApproved
          });
        } catch (error) {
          console.warn(`Error fetching property ${i}:`, error);
        }
      }

      return properties;
    } catch (error) {
      console.error('Get all properties error:', error);
      throw error;
    }
  }

  // Get user's properties
  async getUserProperties() {
    try {
      const account = await this.getAccount();
      const allProperties = await this.getAllProperties();
      
      return allProperties.filter(property => 
        property.owner.toLowerCase() === account.toLowerCase()
      );
    } catch (error) {
      console.error('Get user properties error:', error);
      throw error;
    }
  }

  // Get properties for sale
  async getPropertiesForSale() {
    try {
      const allProperties = await this.getAllProperties();
      
      return allProperties.filter(property => property.isForSale);
    } catch (error) {
      console.error('Get properties for sale error:', error);
      throw error;
    }
  }

  // Check if user is connected
  async isConnected() {
    try {
      const provider = await detectEthereumProvider();
      if (!provider) return false;
      
      const accounts = await provider.request({ method: 'eth_accounts' });
      return accounts.length > 0;
    } catch (error) {
      return false;
    }
  }

  // Get network information
  async getNetworkInfo() {
    try {
      if (!this.provider) {
        await this.connect();
      }
      
      const network = await this.provider.getNetwork();
      const balance = await this.provider.getBalance(this.account);
      
      return {
        chainId: network.chainId,
        name: network.name,
        balance: this.weiToEth(balance)
      };
    } catch (error) {
      console.error('Get network info error:', error);
      throw error;
    }
  }
}

// Create and export a singleton instance
const blockchainService = new BlockchainService();
export default blockchainService;

// Export individual functions for backward compatibility
export const getContract = () => blockchainService.getContract();
export const connect = () => blockchainService.connect();
export const registerProperty = (location, metadataURI, priceInEth) => 
  blockchainService.registerProperty(location, metadataURI, priceInEth);
export const updateListing = (propertyId, newPriceInEth, listForSale) => 
  blockchainService.updateListing(propertyId, newPriceInEth, listForSale);
export const approvePurchase = (propertyId, approval) => 
  blockchainService.approvePurchase(propertyId, approval);
export const completePurchase = (propertyId, priceInEth) => 
  blockchainService.completePurchase(propertyId, priceInEth);
export const getPropertyDetails = (propertyId) => 
  blockchainService.getPropertyDetails(propertyId);
export const getAllProperties = () => blockchainService.getAllProperties();
export const getUserProperties = () => blockchainService.getUserProperties();
export const getPropertiesForSale = () => blockchainService.getPropertiesForSale();
export const isConnected = () => blockchainService.isConnected();
export const getNetworkInfo = () => blockchainService.getNetworkInfo();
