// File: pages/addproperty.js

import React, { useState } from 'react';
import Navbar from '../components/ui/navbar';
import HeroBanner from '../components/ui/herobanner';

const PropertyForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    price: '',
    sqft: '',
    bedrooms: '',
    bathrooms: '',
    yearBuilt: '',
    description: '',
    propertyType: 'apartment',
    image: '',
    contactEmail: '',
    contactPhone: '',
  });

  const [legalDocuments, setLegalDocuments] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const propertyTypes = [
    { value: 'apartment', label: 'Apartment' },
    { value: 'house', label: 'House' },
    { value: 'villa', label: 'Villa' },
    { value: 'condo', label: 'Condo' },
    { value: 'penthouse', label: 'Penthouse' },
    { value: 'studio', label: 'Studio' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      const isValidType = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'].includes(file.type);
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      setErrorMessage('Some files were rejected. Only PDF, JPEG, PNG files up to 10MB are allowed.');
      return;
    }

    setLegalDocuments(prev => [...prev, ...validFiles]);
    setErrorMessage('');
  };

  const removeDocument = (index) => {
    setLegalDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    let newErrors = {};
    
    // Required fields validation
    if (!formData.title.trim()) newErrors.title = 'Property title is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.price.trim()) newErrors.price = 'Price is required';
    if (!formData.sqft.trim()) newErrors.sqft = 'Square footage is required';
    if (!formData.bedrooms.trim()) newErrors.bedrooms = 'Number of bedrooms is required';
    if (!formData.bathrooms.trim()) newErrors.bathrooms = 'Number of bathrooms is required';
    if (!formData.yearBuilt.trim()) newErrors.yearBuilt = 'Year built is required';
    if (!formData.contactEmail.trim()) newErrors.contactEmail = 'Contact email is required';
    if (!formData.contactPhone.trim()) newErrors.contactPhone = 'Contact phone is required';
    
    // Email validation
    if (formData.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email address';
    }
    
    // Phone validation
    if (formData.contactPhone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.contactPhone.replace(/\s/g, ''))) {
      newErrors.contactPhone = 'Please enter a valid phone number';
    }
    
    // Price validation
    if (formData.price && isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Please enter a valid price';
    }
    
    // Year validation
    if (formData.yearBuilt && (isNaN(formData.yearBuilt) || parseInt(formData.yearBuilt) < 1800 || parseInt(formData.yearBuilt) > new Date().getFullYear())) {
      newErrors.yearBuilt = 'Please enter a valid year';
    }
    
    // Image URL validation (optional but if provided, must be valid)
    if (formData.image && !formData.image.match(/^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/)) {
      newErrors.image = 'Please enter a valid image URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    
    if (!validate()) {
      setErrorMessage('Please fix the errors above before submitting.');
      return;
    }

    setLoading(true);

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      
      // Add property data
      formDataToSend.append('propertyData', JSON.stringify({
        ...formData,
        price: parseFloat(formData.price),
        sqft: parseFloat(formData.sqft),
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        yearBuilt: parseInt(formData.yearBuilt),
      }));

      // Add legal documents
      legalDocuments.forEach((file, index) => {
        formDataToSend.append(`legalDocument_${index}`, file);
      });

      // Send to Django backend
      const response = await fetch('http://localhost:8000/api/properties/', {
        method: 'POST',
        body: formDataToSend
      });

      if (response.ok) {
        const data = await response.json();
        console.log('API Response:', data);
        setSuccessMessage(`Property submitted successfully! ${data.files_uploaded || 0} files uploaded.`);
        
        // Reset form
        setFormData({
          title: '',
          location: '',
          price: '',
          sqft: '',
          bedrooms: '',
          bathrooms: '',
          yearBuilt: '',
          description: '',
          propertyType: 'apartment',
          image: '',
          contactEmail: '',
          contactPhone: '',
        });
        setLegalDocuments([]);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Failed to submit property. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting property:', error);
      setErrorMessage('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <HeroBanner />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              List Your Property
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Reach thousands of potential buyers. Fill out the form below to list your property with us.
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-8 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Property Basic Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-lg font-semibold text-white mb-2">
                    Property Title *
                  </label>
              <input
                    type="text"
                    name="title"
                    placeholder="e.g., Beautiful 3BR Apartment in Downtown"
                    value={formData.title}
                onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border-2 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all ${
                      errors.title ? 'border-red-500' : 'border-white/20'
                    }`}
              />
                  {errors.title && (
                    <p className="text-red-400 text-sm mt-1">{errors.title}</p>
                  )}
            </div>

                <div>
                  <label className="block text-lg font-semibold text-white mb-2">
                    Property Type
                  </label>
                  <select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border-2 border-white/20 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
                  >
                    {propertyTypes.map(type => (
                      <option key={type.value} value={type.value} className="bg-gray-800">
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Location */}
          <div>
                <label className="block text-lg font-semibold text-white mb-2">
                  Location *
                </label>
            <input
              type="text"
                  name="location"
                  placeholder="e.g., 123 Main St, City, State"
                  value={formData.location}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border-2 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all ${
                    errors.location ? 'border-red-500' : 'border-white/20'
                  }`}
                />
                {errors.location && (
                  <p className="text-red-400 text-sm mt-1">{errors.location}</p>
                )}
              </div>

              {/* Price and Square Footage */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-lg font-semibold text-white mb-2">
                    Price (USD) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                    <input
                      type="number"
                      name="price"
                      placeholder="500000"
                      value={formData.price}
                      onChange={handleChange}
                      className={`w-full pl-8 pr-4 py-3 rounded-lg border-2 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all ${
                        errors.price ? 'border-red-500' : 'border-white/20'
                      }`}
                    />
                  </div>
                  {errors.price && (
                    <p className="text-red-400 text-sm mt-1">{errors.price}</p>
                  )}
                </div>

                <div>
                  <label className="block text-lg font-semibold text-white mb-2">
                    Square Footage *
                  </label>
                  <input
                    type="number"
                    name="sqft"
                    placeholder="1500"
                    value={formData.sqft}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border-2 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all ${
                      errors.sqft ? 'border-red-500' : 'border-white/20'
                    }`}
                  />
                  {errors.sqft && (
                    <p className="text-red-400 text-sm mt-1">{errors.sqft}</p>
                  )}
                </div>
              </div>

              {/* Bedrooms, Bathrooms, Year Built */}
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-lg font-semibold text-white mb-2">
                    Bedrooms *
                  </label>
                  <input
                    type="number"
                    name="bedrooms"
                    placeholder="3"
                    min="0"
                    value={formData.bedrooms}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border-2 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all ${
                      errors.bedrooms ? 'border-red-500' : 'border-white/20'
                    }`}
                  />
                  {errors.bedrooms && (
                    <p className="text-red-400 text-sm mt-1">{errors.bedrooms}</p>
                  )}
                </div>

                <div>
                  <label className="block text-lg font-semibold text-white mb-2">
                    Bathrooms *
                  </label>
                  <input
                    type="number"
                    name="bathrooms"
                    placeholder="2"
                    min="0"
                    step="0.5"
                    value={formData.bathrooms}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border-2 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all ${
                      errors.bathrooms ? 'border-red-500' : 'border-white/20'
                    }`}
                  />
                  {errors.bathrooms && (
                    <p className="text-red-400 text-sm mt-1">{errors.bathrooms}</p>
                  )}
                </div>

                <div>
                  <label className="block text-lg font-semibold text-white mb-2">
                    Year Built *
                  </label>
                  <input
                    type="number"
                    name="yearBuilt"
                    placeholder="2020"
                    min="1800"
                    max={new Date().getFullYear()}
                    value={formData.yearBuilt}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border-2 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all ${
                      errors.yearBuilt ? 'border-red-500' : 'border-white/20'
                    }`}
                  />
                  {errors.yearBuilt && (
                    <p className="text-red-400 text-sm mt-1">{errors.yearBuilt}</p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-lg font-semibold text-white mb-2">
                  Property Description
                </label>
                <textarea
                  name="description"
                  placeholder="Describe your property, its features, amenities, and what makes it special..."
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 rounded-lg border-2 border-white/20 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all resize-none"
                />
              </div>

              {/* Contact Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-lg font-semibold text-white mb-2">
                    Contact Email *
                  </label>
                  <input
                    type="email"
                    name="contactEmail"
                    placeholder="your.email@example.com"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border-2 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all ${
                      errors.contactEmail ? 'border-red-500' : 'border-white/20'
                    }`}
                  />
                  {errors.contactEmail && (
                    <p className="text-red-400 text-sm mt-1">{errors.contactEmail}</p>
                  )}
                </div>

                <div>
                  <label className="block text-lg font-semibold text-white mb-2">
                    Contact Phone *
                  </label>
                  <input
                    type="tel"
                    name="contactPhone"
                    placeholder="+1 (555) 123-4567"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border-2 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all ${
                      errors.contactPhone ? 'border-red-500' : 'border-white/20'
                    }`}
                  />
                  {errors.contactPhone && (
                    <p className="text-red-400 text-sm mt-1">{errors.contactPhone}</p>
                  )}
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-lg font-semibold text-white mb-2">
                  Property Image URL
                </label>
                <input
                  type="url"
              name="image"
                  placeholder="https://example.com/property-image.jpg"
              value={formData.image}
              onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border-2 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all ${
                    errors.image ? 'border-red-500' : 'border-white/20'
                  }`}
            />
            {errors.image && (
                  <p className="text-red-400 text-sm mt-1">{errors.image}</p>
                )}
                <p className="text-gray-400 text-sm mt-1">
                  Provide a direct link to a high-quality image of your property
                </p>
              </div>

              {/* Legal Documents Upload */}
              <div>
                <label className="block text-lg font-semibold text-white mb-2">
                  Legal Documents
                </label>
                <div className="border-2 border-dashed border-white/20 rounded-lg p-6 bg-white/5 hover:bg-white/10 transition-all">
                  <div className="text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="mt-4">
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-white">
                          <span className="text-yellow-500 hover:text-yellow-400">Click to upload</span> or drag and drop
                        </span>
                        <span className="mt-1 block text-xs text-gray-400">
                          PDF, JPEG, PNG files up to 10MB each
                        </span>
                      </label>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileUpload}
                        className="sr-only"
                      />
                    </div>
                  </div>
                </div>

                {/* Uploaded Files List */}
                {legalDocuments.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h4 className="text-sm font-medium text-white">Uploaded Documents:</h4>
                    {legalDocuments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <svg className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                          </svg>
                          <div>
                            <p className="text-sm font-medium text-white">{file.name}</p>
                            <p className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeDocument(index)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
            )}
          </div>

              {/* Submit Button */}
              <div className="pt-6">
          <button
            type="submit"
            disabled={loading}
                  className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold py-4 px-8 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                      Submitting Property...
                    </div>
                  ) : (
                    'Submit Property Listing'
                  )}
          </button>
              </div>

              {/* Messages */}
          {successMessage && (
                <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
                  <p className="text-green-400 font-semibold text-center">{successMessage}</p>
                </div>
              )}

              {errorMessage && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
                  <p className="text-red-400 font-semibold text-center">{errorMessage}</p>
                </div>
          )}
        </form>
          </div>

          {/* Footer Note */}
          <div className="text-center mt-8">
            <p className="text-gray-400 text-sm">
              By submitting this form, you agree to our terms of service and privacy policy.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertyForm;
