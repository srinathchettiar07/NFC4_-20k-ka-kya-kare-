# IPFS Document Upload System - Setup Guide

This guide will help you set up the complete IPFS document upload system for your decentralized real estate registry.

## 🚀 Quick Start

### 1. Environment Setup

First, create a `.env` file in the `backend` directory:

```bash
cd backend
touch .env  # On Windows: echo. > .env
```

Add the following to your `.env` file:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/real-estate-registry

# Infura IPFS Configuration
INFURA_PROJECT_ID=your_infura_project_id
INFURA_PROJECT_SECRET=your_infura_project_secret

# JWT Configuration (for future authentication)
JWT_SECRET=your_jwt_secret_key

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

### 2. Infura IPFS Setup

1. **Create Infura Account**
   - Go to [Infura](https://infura.io/)
   - Sign up for a free account
   - Verify your email

2. **Create IPFS Project**
   - Log in to Infura dashboard
   - Click "Create New Project"
   - Select "IPFS" as the network
   - Give your project a name (e.g., "Real Estate Registry")
   - Click "Create"

3. **Get Credentials**
   - In your project dashboard, go to "Settings"
   - Copy your "Project ID" and "Project Secret"
   - Add them to your `.env` file

### 3. MongoDB Setup

#### Option A: Local MongoDB
```bash
# Install MongoDB locally
# On Windows: Download from https://www.mongodb.com/try/download/community
# On Mac: brew install mongodb-community
# On Ubuntu: sudo apt install mongodb

# Start MongoDB
mongod
```

#### Option B: MongoDB Atlas (Cloud)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string
5. Replace `MONGO_URI` in `.env` with your Atlas connection string

### 4. Test Setup

Run the setup test to verify everything is working:

```bash
cd backend
npm run test-setup
```

This will test:
- ✅ IPFS connection via Infura
- ✅ MongoDB connection
- ✅ Environment variables
- ✅ Document model creation

### 5. Start the Application

#### Start Backend
```bash
cd backend
npm run dev
```

You should see:
```
Server running on localhost : 5000
```

#### Start Frontend
```bash
cd frontend
npm run dev
```

You should see:
```
Local:   http://localhost:5173/
```

### 6. Access the Application

1. Open your browser to `http://localhost:5173`
2. Sign up or log in
3. Navigate to "Document Manager" from the dashboard
4. Start uploading documents!

## 🔧 Configuration Details

### Backend Configuration

The backend includes:

- **IPFS Integration**: Upload files to IPFS via Infura
- **File Validation**: Type and size validation (PDF, JPEG, PNG, max 10MB)
- **MongoDB Storage**: Document metadata storage
- **Error Handling**: Comprehensive error handling and logging
- **CORS**: Configured for frontend communication

### Frontend Configuration

The frontend includes:

- **File Upload Component**: Drag & drop interface
- **Document Viewer**: Display uploaded documents
- **Progress Tracking**: Real-time upload progress
- **Error Handling**: User-friendly error messages
- **Responsive Design**: Works on all devices

## 📁 File Structure

```
backend/
├── src/
│   ├── models/
│   │   └── Document.js          # MongoDB document schema
│   ├── controllers/
│   │   └── ipfsController.js    # IPFS upload logic
│   ├── routes/
│   │   └── ipfsRoutes.js        # API endpoints
│   ├── middleware/
│   │   └── uploadMiddleware.js   # File upload handling
│   ├── lib/
│   │   └── ipfs.js              # IPFS utility functions
│   └── server.js                # Express server
├── .env                         # Environment variables
└── test-ipfs.js                # Setup test script

frontend/
├── src/
│   ├── components/
│   │   ├── FileUpload.jsx       # Upload component
│   │   └── DocumentViewer.jsx   # Document display
│   ├── pages/
│   │   └── DocumentManager.jsx  # Main document page
│   ├── lib/
│   │   └── api.js              # API functions
│   └── App.jsx                 # Routing
```

## 🧪 Testing the System

### Test File Upload

1. **Prepare Test Files**
   - Create a small PDF file (< 1MB)
   - Create a small JPEG image (< 1MB)
   - Ensure files are valid formats

2. **Upload Test**
   - Go to Document Manager
   - Click "Upload Documents"
   - Drag and drop your test files
   - Click "Upload Documents to IPFS"
   - Verify files appear in the document list

3. **Verify IPFS Storage**
   - Click on a document to view it
   - Check that the IPFS URL works
   - Verify the document is accessible

### API Testing

You can test the API endpoints directly:

```bash
# Get all documents
curl http://localhost:5000/api/ipfs/documents

# Upload a file (using Postman or similar)
POST http://localhost:5000/api/ipfs/upload
Content-Type: multipart/form-data
Body: files=@your-file.pdf
```

## 🔒 Security Considerations

### Environment Variables
- ✅ Never commit `.env` files to version control
- ✅ Use strong, unique secrets
- ✅ Rotate credentials regularly

### File Validation
- ✅ File type validation on frontend and backend
- ✅ File size limits enforced
- ✅ MIME type checking
- ✅ No executable files allowed

### Network Security
- ✅ CORS properly configured
- ✅ Rate limiting implemented
- ✅ Input sanitization
- ✅ Error handling without information leakage

## 🚨 Troubleshooting

### Common Issues

#### 1. IPFS Upload Fails
**Symptoms**: Upload fails with "Failed to upload file to IPFS"
**Solutions**:
- Check Infura credentials in `.env`
- Verify internet connection
- Ensure Infura project is active
- Check file size limits

#### 2. MongoDB Connection Issues
**Symptoms**: Server fails to start or database errors
**Solutions**:
- Verify MongoDB is running
- Check connection string in `.env`
- Ensure database exists
- Check network connectivity

#### 3. CORS Errors
**Symptoms**: Frontend can't connect to backend
**Solutions**:
- Verify CORS configuration in backend
- Check frontend URL matches CORS origin
- Ensure both servers are running

#### 4. File Upload Validation
**Symptoms**: Files rejected during upload
**Solutions**:
- Check file type (PDF, JPEG, PNG only)
- Verify file size (< 10MB)
- Check multer configuration
- Ensure proper MIME types

### Debug Commands

```bash
# Test IPFS connection
cd backend && npm run test-setup

# Check MongoDB connection
mongosh "mongodb://localhost:27017/real-estate-registry"

# View server logs
cd backend && npm run dev

# Check frontend console
# Open browser dev tools and check console
```

## 📈 Performance Optimization

### Backend Optimizations
- Implement file compression
- Add caching for frequently accessed documents
- Use CDN for document delivery
- Implement batch upload capabilities

### Frontend Optimizations
- Lazy load document previews
- Implement virtual scrolling for large lists
- Add progressive image loading
- Optimize bundle size

## 🔮 Future Enhancements

### Planned Features
- JWT-based authentication
- Property-document linking
- Document versioning
- Blockchain anchoring
- Advanced search and filtering
- Document sharing and access control
- Pinata integration for permanent pinning
- Custom IPFS gateway support

### Scalability Considerations
- Implement caching for frequently accessed documents
- Add CDN integration for faster document delivery
- Implement document compression
- Add batch upload capabilities
- Implement document categories and tags

## 📞 Support

If you encounter issues:

1. **Check the troubleshooting section above**
2. **Run the setup test**: `npm run test-setup`
3. **Check server logs** for detailed error messages
4. **Verify environment variables** are correctly set
5. **Test with smaller files** first

## 🎉 Success!

Once everything is working:

- ✅ Files upload to IPFS successfully
- ✅ Documents appear in the viewer
- ✅ IPFS URLs are accessible
- ✅ MongoDB stores document metadata
- ✅ Frontend and backend communicate properly

You now have a fully functional decentralized document storage system for your real estate registry! 