from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import json
import os
from datetime import datetime

def home(request):
    return render(request, 'home.html')

@csrf_exempt
@require_http_methods(["POST"])
def property_api(request):
    """
    Handle property submissions from the frontend with file uploads
    """
    try:
        # Check if this is a multipart form data request (file upload)
        if request.content_type and 'multipart/form-data' in request.content_type:
            # Handle file upload
            property_data = json.loads(request.POST.get('propertyData', '{}'))
            
            # Save uploaded files
            uploaded_files = []
            for key, value in request.FILES.items():
                if key.startswith('legalDocument_'):
                    # Generate unique filename
                    file_name = f"legal_documents/{datetime.now().strftime('%Y%m%d_%H%M%S')}_{value.name}"
                    file_path = default_storage.save(file_name, ContentFile(value.read()))
                    uploaded_files.append({
                        'original_name': value.name,
                        'file_path': file_path,
                        'file_size': value.size,
                        'content_type': value.content_type
                    })
            
            # Log the submission (simple file storage without database)
            print(f"Property submission received:")
            print(f"Title: {property_data.get('title', 'N/A')}")
            print(f"Location: {property_data.get('location', 'N/A')}")
            print(f"Price: {property_data.get('price', 'N/A')}")
            print(f"Contact Email: {property_data.get('contactEmail', 'N/A')}")
            print(f"Files uploaded: {len(uploaded_files)}")
            for file_info in uploaded_files:
                print(f"  - {file_info['original_name']} -> {file_info['file_path']}")
            
            return JsonResponse({
                'success': True,
                'message': 'Property submitted successfully! Files saved.',
                'files_uploaded': len(uploaded_files),
                'timestamp': datetime.now().isoformat()
            }, status=201)
            
        else:
            # Handle JSON data (fallback)
            data = json.loads(request.body)
            print(f"Property submission received (JSON): {data}")
            
            return JsonResponse({
                'success': True,
                'message': 'Property submitted successfully!',
                'timestamp': datetime.now().isoformat()
            }, status=201)
            
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'message': 'Invalid JSON data',
            'timestamp': datetime.now().isoformat()
        }, status=400)
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': f'Server error: {str(e)}',
            'timestamp': datetime.now().isoformat()
        }, status=500)
