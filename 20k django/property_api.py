#!/usr/bin/env python3
"""
Property API Handler
Handles incoming property submissions from the frontend
"""

import json
import logging
from datetime import datetime
from typing import Dict, Any, Optional
import os
import sqlite3
from pathlib import Path

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('property_api.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class PropertyAPI:
    def __init__(self, db_path: str = "properties.db"):
        """Initialize the Property API with database connection"""
        self.db_path = db_path
        self.init_database()
    
    def init_database(self):
        """Initialize the SQLite database with properties table"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS properties (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title TEXT NOT NULL,
                    location TEXT NOT NULL,
                    price REAL NOT NULL,
                    sqft REAL NOT NULL,
                    bedrooms INTEGER NOT NULL,
                    bathrooms REAL NOT NULL,
                    year_built INTEGER NOT NULL,
                    description TEXT,
                    property_type TEXT DEFAULT 'apartment',
                    image_url TEXT,
                    contact_email TEXT NOT NULL,
                    contact_phone TEXT NOT NULL,
                    status TEXT DEFAULT 'pending',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            conn.commit()
            conn.close()
            logger.info("Database initialized successfully")
            
        except Exception as e:
            logger.error(f"Error initializing database: {e}")
            raise
    
    def validate_property_data(self, data: Dict[str, Any]) -> tuple[bool, Optional[str]]:
        """Validate incoming property data"""
        required_fields = [
            'title', 'location', 'price', 'sqft', 
            'bedrooms', 'bathrooms', 'yearBuilt', 
            'contactEmail', 'contactPhone'
        ]
        
        # Check required fields
        for field in required_fields:
            if not data.get(field):
                return False, f"Missing required field: {field}"
        
        # Validate data types and ranges
        try:
            price = float(data['price'])
            if price <= 0:
                return False, "Price must be greater than 0"
            
            sqft = float(data['sqft'])
            if sqft <= 0:
                return False, "Square footage must be greater than 0"
            
            bedrooms = int(data['bedrooms'])
            if bedrooms < 0:
                return False, "Bedrooms cannot be negative"
            
            bathrooms = float(data['bathrooms'])
            if bathrooms < 0:
                return False, "Bathrooms cannot be negative"
            
            year_built = int(data['yearBuilt'])
            current_year = datetime.now().year
            if year_built < 1800 or year_built > current_year:
                return False, f"Year built must be between 1800 and {current_year}"
            
        except (ValueError, TypeError) as e:
            return False, f"Invalid data type: {str(e)}"
        
        # Validate email format
        import re
        email_pattern = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
        if not re.match(email_pattern, data['contactEmail']):
            return False, "Invalid email format"
        
        return True, None
    
    def save_property(self, data: Dict[str, Any]) -> tuple[bool, Optional[str], Optional[int]]:
        """Save property data to database"""
        try:
            # Validate data first
            is_valid, error_msg = self.validate_property_data(data)
            if not is_valid:
                return False, error_msg, None
            
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Prepare data for insertion
            property_data = {
                'title': data['title'],
                'location': data['location'],
                'price': float(data['price']),
                'sqft': float(data['sqft']),
                'bedrooms': int(data['bedrooms']),
                'bathrooms': float(data['bathrooms']),
                'year_built': int(data['yearBuilt']),
                'description': data.get('description', ''),
                'property_type': data.get('propertyType', 'apartment'),
                'image_url': data.get('image', ''),
                'contact_email': data['contactEmail'],
                'contact_phone': data['contactPhone'],
                'status': 'pending'
            }
            
            cursor.execute('''
                INSERT INTO properties (
                    title, location, price, sqft, bedrooms, bathrooms, 
                    year_built, description, property_type, image_url, 
                    contact_email, contact_phone, status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                property_data['title'], property_data['location'], 
                property_data['price'], property_data['sqft'], 
                property_data['bedrooms'], property_data['bathrooms'],
                property_data['year_built'], property_data['description'],
                property_data['property_type'], property_data['image_url'],
                property_data['contact_email'], property_data['contact_phone'],
                property_data['status']
            ))
            
            property_id = cursor.lastrowid
            conn.commit()
            conn.close()
            
            logger.info(f"Property saved successfully with ID: {property_id}")
            return True, "Property saved successfully", property_id
            
        except Exception as e:
            logger.error(f"Error saving property: {e}")
            return False, f"Database error: {str(e)}", None
    
    def get_property(self, property_id: int) -> Optional[Dict[str, Any]]:
        """Retrieve a property by ID"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('SELECT * FROM properties WHERE id = ?', (property_id,))
            row = cursor.fetchone()
            conn.close()
            
            if row:
                columns = [description[0] for description in cursor.description]
                return dict(zip(columns, row))
            
            return None
            
        except Exception as e:
            logger.error(f"Error retrieving property: {e}")
            return None
    
    def get_all_properties(self, status: str = None) -> list[Dict[str, Any]]:
        """Retrieve all properties, optionally filtered by status"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            if status:
                cursor.execute('SELECT * FROM properties WHERE status = ? ORDER BY created_at DESC', (status,))
            else:
                cursor.execute('SELECT * FROM properties ORDER BY created_at DESC')
            
            rows = cursor.fetchall()
            conn.close()
            
            if rows:
                columns = [description[0] for description in cursor.description]
                return [dict(zip(columns, row)) for row in rows]
            
            return []
            
        except Exception as e:
            logger.error(f"Error retrieving properties: {e}")
            return []
    
    def update_property_status(self, property_id: int, status: str) -> bool:
        """Update property status"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('''
                UPDATE properties 
                SET status = ?, updated_at = CURRENT_TIMESTAMP 
                WHERE id = ?
            ''', (status, property_id))
            
            conn.commit()
            conn.close()
            
            logger.info(f"Property {property_id} status updated to {status}")
            return True
            
        except Exception as e:
            logger.error(f"Error updating property status: {e}")
            return False

def handle_property_submission(request_data: Dict[str, Any]) -> Dict[str, Any]:
    """Handle incoming property submission request"""
    try:
        api = PropertyAPI()
        
        # Log the incoming request
        logger.info(f"Received property submission: {json.dumps(request_data, indent=2)}")
        
        # Save the property
        success, message, property_id = api.save_property(request_data)
        
        if success:
            return {
                'success': True,
                'message': message,
                'property_id': property_id,
                'timestamp': datetime.now().isoformat()
            }
        else:
            return {
                'success': False,
                'message': message,
                'timestamp': datetime.now().isoformat()
            }
            
    except Exception as e:
        logger.error(f"Error handling property submission: {e}")
        return {
            'success': False,
            'message': f"Internal server error: {str(e)}",
            'timestamp': datetime.now().isoformat()
        }

if __name__ == "__main__":
    # Test the API
    test_data = {
        'title': 'Test Property',
        'location': '123 Test St, Test City',
        'price': '500000',
        'sqft': '1500',
        'bedrooms': '3',
        'bathrooms': '2',
        'yearBuilt': '2020',
        'description': 'A beautiful test property',
        'propertyType': 'house',
        'image': 'https://example.com/test.jpg',
        'contactEmail': 'test@example.com',
        'contactPhone': '+1234567890'
    }
    
    result = handle_property_submission(test_data)
    print(json.dumps(result, indent=2)) 