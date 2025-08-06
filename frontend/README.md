# Real Estate Blockchain Platform

A comprehensive real estate platform that combines traditional backend functionality with blockchain technology for property management, buying, and selling.

## Features

### 🏠 Property Management
- **Traditional Backend**: Store property data in database with file uploads
- **Blockchain Integration**: Register properties on Ethereum blockchain
- **Dual Submission**: Choose between traditional or blockchain submission methods
- **Property Details**: Comprehensive property information with images and documents

### 🔗 Blockchain Features
- **MetaMask Integration**: Connect your Ethereum wallet
- **Smart Contract Interaction**: Register, list, and purchase properties
- **Multi-Party Approval**: AI, buyer, and seller approval workflow
- **Real-time Updates**: Live blockchain data synchronization
- **Transaction History**: Complete audit trail of all blockchain transactions

### 🎯 User Experience
- **Modern UI**: Beautiful, responsive design with dark theme
- **Real-time Data**: Live Ethereum price feeds and blockchain status
- **Interactive Dashboard**: Manage properties and view blockchain status
- **Modal Dialogs**: Intuitive purchase and approval workflows

## Technology Stack

### Frontend
- **React 19**: Modern React with hooks and context
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Ethers.js**: Ethereum library for blockchain interaction
- **MetaMask**: Wallet connection and transaction signing

### Blockchain
- **Solidity**: Smart contract development
- **Truffle**: Development framework
- **Ganache**: Local blockchain for testing
- **Web3**: Blockchain interaction library

### Backend
- **Django**: Python web framework
- **PostgreSQL**: Database for traditional data
- **File Upload**: Document and image handling

## Getting Started

### Prerequisites
- Node.js 18+ 
- Python 3.8+
- MetaMask browser extension
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd 20k-ka-kya-kare
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install blockchain dependencies**
   ```bash
   cd ../blockchain
   npm install
   ```

4. **Install backend dependencies**
   ```bash
   cd ../20k\ django
   pip install -r requirements.txt
   ```

### Configuration

1. **Blockchain Setup**
   ```bash
   cd blockchain
   # Deploy smart contracts to local network
   truffle migrate --reset
   # Update contract address in frontend/src/lib/blockchain.js
   ```

2. **Backend Setup**
   ```bash
   cd "20k django"
   python manage.py migrate
   python manage.py runserver
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm run dev
   ```

### MetaMask Configuration

1. **Install MetaMask** from [metamask.io](https://metamask.io)
2. **Create or import wallet**
3. **Add local network** (if using Ganache):
   - Network Name: Localhost 8545
   - RPC URL: http://127.0.0.1:8545
   - Chain ID: 1337
   - Currency Symbol: ETH

## Usage

### Connecting Wallet

1. **Navigate to Dashboard**
   - Go to `/dashboard` after logging in
   - Click "Connect Wallet" button
   - Approve MetaMask connection

2. **View Blockchain Status**
   - Check connection status
   - View account address and balance
   - Monitor network information

### Property Registration

#### Traditional Method
1. **Go to Add Property page** (`/addproperty`)
2. **Select "Traditional Backend"**
3. **Fill property details**:
   - Basic information (title, location, price)
   - Property specifications (bedrooms, bathrooms, etc.)
   - Contact information
   - Upload legal documents
4. **Submit** - Data stored in database

#### Blockchain Method
1. **Select "Blockchain" submission**
2. **Ensure wallet is connected**
3. **Fill property details** (same as traditional)
4. **Submit** - Property registered on blockchain
5. **View transaction hash** in success message

### Property Management

#### Dashboard Features
- **My Properties**: View owned properties
- **Properties for Sale**: Browse available properties
- **All Properties**: Complete property registry
- **Blockchain Status**: Real-time approval status

#### Property Actions
- **List for Sale**: Make property available for purchase
- **Remove from Sale**: Take property off market
- **Update Price**: Modify listing price
- **Approve Purchase**: Approve buyer transactions

### Property Purchase

#### Purchase Workflow
1. **Browse Properties**: View properties for sale
2. **Check Approval Status**: Verify AI, buyer, and seller approval
3. **Approve Purchase**: Click "Approve Purchase" if needed
4. **Complete Purchase**: Click "Purchase Property" when all approvals are met
5. **Confirm Transaction**: Approve MetaMask transaction
6. **Ownership Transfer**: Property ownership transferred on blockchain

#### Approval System
- **AI Approval**: Automated validation (requires AI validator)
- **Buyer Approval**: Buyer confirms purchase intent
- **Seller Approval**: Seller confirms sale intent
- **All approvals required** before purchase completion

### Property Details

#### Viewing Properties
- **Traditional Properties**: Standard property listings
- **Blockchain Properties**: Properties with blockchain data
- **Hybrid View**: Properties available in both systems

#### Blockchain Information
- **Token ID**: Unique blockchain identifier
- **Owner Address**: Current property owner
- **Price**: Property price in ETH
- **Sale Status**: Whether property is for sale
- **Approval Status**: AI, buyer, and seller approval status

## Smart Contract Functions

### Core Functions
- `registerProperty()`: Register new property on blockchain
- `updateListing()`: Update property price and sale status
- `approvePurchase()`: Approve or reject purchase
- `completePurchase()`: Execute property transfer
- `getPropertyDetails()`: Retrieve property information

### Events
- `PropertyRegistered`: Emitted when property is registered
- `PropertyListed`: Emitted when property is listed for sale
- `ApprovalGiven`: Emitted when approval is given
- `PropertyTransferred`: Emitted when property is sold

## Security Features

### Blockchain Security
- **Ownership Verification**: Only property owners can modify listings
- **Multi-Party Approval**: Prevents unauthorized transactions
- **Transaction Validation**: Smart contract enforces business rules
- **Immutable Records**: All transactions permanently recorded

### Application Security
- **MetaMask Integration**: Secure wallet connection
- **Input Validation**: Comprehensive form validation
- **Error Handling**: Graceful error handling and user feedback
- **Network Validation**: Ensures correct blockchain network

## Development

### Project Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── BlockchainProvider.jsx    # Blockchain context
│   │   └── ui/                       # UI components
│   ├── lib/
│   │   └── blockchain.js             # Blockchain service
│   ├── pages/
│   │   ├── dashboard.jsx             # Main dashboard
│   │   ├── addproperty.jsx           # Property submission
│   │   └── PropertyDetail.jsx        # Property details
│   └── store/
│       └── AuthStore.js              # Authentication state
```

### Key Components

#### BlockchainProvider
- Manages blockchain connection state
- Provides blockchain functions to components
- Handles MetaMask integration
- Manages property data synchronization

#### BlockchainService
- Core blockchain interaction logic
- Smart contract function wrappers
- Transaction handling
- Data conversion utilities

#### Dashboard
- Property management interface
- Blockchain status display
- Transaction workflows
- Real-time data updates

### Adding New Features

#### New Blockchain Function
1. **Add to Smart Contract**:
   ```solidity
   function newFunction() external {
       // Implementation
   }
   ```

2. **Add to BlockchainService**:
   ```javascript
   async newFunction() {
       const contract = await this.getContract();
       const tx = await contract.newFunction();
       return await tx.wait();
   }
   ```

3. **Add to BlockchainProvider**:
   ```javascript
   const newFunction = async () => {
       const result = await blockchainService.newFunction();
       await loadProperties();
       return result;
   };
   ```

4. **Use in Component**:
   ```javascript
   const { newFunction } = useBlockchain();
   ```

## Troubleshooting

### Common Issues

#### MetaMask Connection
- **Issue**: "MetaMask is not installed"
- **Solution**: Install MetaMask browser extension

#### Network Issues
- **Issue**: "Wrong network"
- **Solution**: Switch to correct network in MetaMask

#### Transaction Failures
- **Issue**: "Transaction failed"
- **Solution**: Check gas fees and account balance

#### Contract Errors
- **Issue**: "Contract not found"
- **Solution**: Verify contract address and deployment

### Debug Mode
Enable debug logging:
```javascript
// In blockchain.js
console.log('Debug:', { contract, account, network });
```

## Contributing

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/new-feature`
3. **Commit changes**: `git commit -am 'Add new feature'`
4. **Push to branch**: `git push origin feature/new-feature`
5. **Submit pull request**

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the smart contract documentation

---

**Note**: This is a development version. For production use, ensure proper security audits and testing.
