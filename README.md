# Property Listing Application

A modern property listing application with a React frontend and Django backend API.

## Features

- **Clean Professional UI**: Modern, responsive design with gradient backgrounds
- **Simple Hero Banner**: Clean and professional 50vh height banner
- **Comprehensive Form**: Property details including title, location, price, square footage, bedrooms, bathrooms, year built, description, property type, and contact information
- **Legal Document Upload**: Support for PDF, JPEG, and PNG file uploads with drag-and-drop interface
- **Form Validation**: Client-side and server-side validation for all fields
- **File Storage**: Simple file storage system without database complexity
- **API Integration**: RESTful API between frontend and backend with file upload support
- **Error Handling**: Comprehensive error handling and user feedback

## Project Structure

```
20k-ka-kya-kare/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── pages/
│   │   │   └── addproperty.jsx  # Property submission form
│   │   └── components/
│   └── package.json
├── 20k django/              # Django backend application
│   ├── home/
│   │   ├── views.py         # API views with file handling
│   │   └── urls.py          # URL routing
│   ├── hackathon/
│   │   ├── settings.py      # Django settings
│   │   └── urls.py          # Main URL configuration
│   └── requirements.txt     # Python dependencies
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- Python (v3.8 or higher)
- npm or yarn

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`

### Backend Setup

1. Navigate to the Django directory:
   ```bash
   cd "20k django"
   ```

2. Create a virtual environment (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Start the Django development server:
   ```bash
   python manage.py runserver
   ```

The backend API will be available at `http://localhost:8000`

## API Endpoints

### POST /api/properties/
Submit a new property listing with optional file uploads

**Request Body (Multipart Form Data):**
```
propertyData: {
  "title": "Beautiful 3BR Apartment",
  "location": "123 Main St, City, State",
  "price": "500000",
  "sqft": "1500",
  "bedrooms": "3",
  "bathrooms": "2",
  "yearBuilt": "2020",
  "description": "A beautiful apartment with modern amenities",
  "propertyType": "apartment",
  "image": "https://example.com/image.jpg",
  "contactEmail": "seller@example.com",
  "contactPhone": "+1234567890"
}
legalDocument_0: [PDF/JPEG/PNG file]
legalDocument_1: [PDF/JPEG/PNG file]
...
```

**Response:**
```json
{
  "success": true,
  "message": "Property submitted successfully! Files saved.",
  "files_uploaded": 2,
  "timestamp": "2024-01-01T12:00:00"
}
```

## Form Features

### Validation Rules
- **Required Fields**: Title, location, price, square footage, bedrooms, bathrooms, year built, contact email, contact phone
- **Email Validation**: Must be a valid email format
- **Phone Validation**: Must be a valid phone number
- **Price Validation**: Must be a positive number
- **Year Validation**: Must be between 1800 and current year
- **Image URL**: Optional but must be a valid URL if provided
- **File Upload**: PDF, JPEG, PNG files up to 10MB each

### UI Features
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Real-time Validation**: Shows errors as user types
- **Loading States**: Visual feedback during form submission
- **Success/Error Messages**: Clear feedback for user actions
- **Professional Styling**: Modern gradient backgrounds and glass-morphism effects
- **File Upload Interface**: Drag-and-drop file upload with preview and remove functionality
- **Clean Hero Banner**: Simple, professional design with 50vh height

## File Storage

The application uses Django's file storage system to save uploaded files:

- **File Location**: `media/legal_documents/` directory
- **File Naming**: Timestamp-based unique filenames
- **File Types**: PDF, JPEG, PNG
- **File Size**: Up to 10MB per file
- **Storage**: Local file system (no database storage)

## Usage

1. Open the frontend application in your browser
2. Navigate to the "Add Property" page
3. Fill out the property details form
4. Upload legal documents (optional)
5. Submit the form
6. Property details are logged to console and files are saved to media directory

## Development

### Adding New Features
- Frontend changes: Edit files in `frontend/src/`
- Backend changes: Edit files in `20k django/home/`
- API changes: Modify `views.py`

### Testing
- Frontend: The form includes comprehensive client-side validation
- Backend: Check console logs for property submissions
- File Upload: Files are saved to `media/legal_documents/` directory

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure the Django server is running and CORS settings are configured
2. **File Upload Errors**: Check that the media directory exists and has write permissions
3. **Port Conflicts**: Change the port in the respective configuration files if needed

### Logs
- Backend logs are printed to console for property submissions
- Check the browser console for frontend errors
- Files are saved to `media/legal_documents/` directory

## License

This project is for educational purposes.