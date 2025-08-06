import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Verified, 
  Building, 
  TrendingUp, 
  Eye, 
  Shield, 
  Clock, 
  Star, 
  Users, 
  Award, 
  ArrowLeft,
  Home,
  DollarSign,
  Percent,
  Calendar,
  Square,
  Bed,
  Bath,
  Car,
  Wifi,
  
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

// Mock property data - in real app this would come from API
const properties = [
  {
    id: 1,
    title: "Modern Downtown Penthouse",
    location: "Manhattan, NY",
    price: "2.5 ETH",
    usdPrice: "$4,250,000",
    image: "/modern-penthouse-interior.png",
    verified: true,
    tokenId: "#7834",
    lastSale: "2.1 ETH",
    owner: "0x742d...35Bd",
    type: "Residential",
    sqft: "2,400",
    bedrooms: 3,
    bathrooms: 2,
    yearBuilt: 2020,
    views: 1247,
    description: "Luxurious penthouse with panoramic city views, smart home technology, and premium amenities. This stunning property offers the perfect blend of modern luxury and urban convenience.",
    features: ["Smart Home", "Rooftop Terrace", "Gym", "Concierge", "Security System", "Parking"],
    propertyType: "Penthouse",
    status: "For Sale",
    address: "123 Park Avenue, New York, NY 10001",
    lotSize: "2,400 sq ft",
    propertyTax: "$45,000/year",
    hoaFees: "$1,200/month",
    utilities: "Included",
    parking: "2 spaces",
    heating: "Central",
    cooling: "Central AC",
    appliances: "All included",
    flooring: "Hardwood",
    roof: "Flat roof with terrace",
    exterior: "Glass and steel",
    interior: "Modern minimalist",
    views: "City skyline",
    nearby: ["Central Park", "Metropolitan Museum", "5th Avenue Shopping", "Subway Station"],
    schools: ["PS 6", "Stuyvesant High School", "NYU"],
    transportation: ["Subway: 4,5,6,N,R,W", "Bus: M1, M2, M3"],
    images: [
      "/modern-penthouse-interior.png",
      "/modern-penthouse-interior.png",
      "/modern-penthouse-interior.png",
      "/modern-penthouse-interior.png"
    ]
  },
  // Add more properties as needed
];

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [ethPrice, setEthPrice] = useState(3420.5);

  useEffect(() => {
    // Fetch real-time Ethereum price
    const fetchEthPrice = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
        const data = await response.json();
        if (data.ethereum) {
          setEthPrice(data.ethereum.usd);
        }
      } catch (error) {
        console.log('Error fetching ETH price:', error);
      }
    };

    fetchEthPrice();

    // Find property by ID
    const foundProperty = properties.find(p => p.id === parseInt(id));
    setProperty(foundProperty);
  }, [id]);

  if (!property) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-white mb-4">Property Not Found</div>
          <Button onClick={() => navigate('/')} className="bg-yellow-500 hover:bg-yellow-600 text-black">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const usdValue = parseFloat(property.price.split(' ')[0]) * ethPrice;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <header className="bg-black/95 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button 
              onClick={() => navigate('/')} 
              variant="ghost" 
              className="text-gray-300 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Properties
            </Button>
            <div className="flex items-center space-x-4">
              <Badge className="bg-yellow-600 text-black">
                <Verified className="w-3 h-3 mr-1" />
                AI Verified
              </Badge>
              <Badge variant="outline" className="border-gray-600 text-gray-300">
                {property.tokenId}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Property Images */}
            <Card className="border-gray-800 bg-gray-900/80 backdrop-blur-md">
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={property.images[selectedImage]}
                    alt={property.title}
                    className="w-full h-96 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-yellow-600 text-black">
                      <Verified className="w-3 h-3 mr-1" />
                      AI Verified
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge variant="outline" className="border-gray-600 text-gray-300">
                      {property.tokenId}
                    </Badge>
                  </div>
                </div>
                
                {/* Image Thumbnails */}
                <div className="p-4">
                  <div className="flex space-x-2 overflow-x-auto">
                    {property.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImage === index 
                            ? 'border-yellow-500' 
                            : 'border-gray-700 hover:border-gray-600'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${property.title} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Property Details */}
            <Card className="border-gray-800 bg-gray-900/80 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white">{property.title}</CardTitle>
                <div className="flex items-center text-gray-300">
                  <MapPin className="w-4 h-4 mr-2" />
                  {property.address}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-300 leading-relaxed">{property.description}</p>
                
                {/* Key Features */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Key Features</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {property.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-gray-300">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Property Specifications */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Property Specifications</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                      <Square className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
                      <div className="text-white font-semibold">{property.sqft}</div>
                      <div className="text-gray-400 text-sm">Square Feet</div>
                    </div>
                    <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                      <Bed className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
                      <div className="text-white font-semibold">{property.bedrooms}</div>
                      <div className="text-gray-400 text-sm">Bedrooms</div>
                    </div>
                    <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                      <Bath className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
                      <div className="text-white font-semibold">{property.bathrooms}</div>
                      <div className="text-gray-400 text-sm">Bathrooms</div>
                    </div>
                    <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                      <Calendar className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
                      <div className="text-white font-semibold">{property.yearBuilt}</div>
                      <div className="text-gray-400 text-sm">Year Built</div>
                    </div>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Property Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Property Type:</span>
                        <span className="text-white">{property.propertyType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Lot Size:</span>
                        <span className="text-white">{property.lotSize}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Parking:</span>
                        <span className="text-white">{property.parking}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Heating:</span>
                        <span className="text-white">{property.heating}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Cooling:</span>
                        <span className="text-white">{property.cooling}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Financial Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Property Tax:</span>
                        <span className="text-white">{property.propertyTax}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">HOA Fees:</span>
                        <span className="text-white">{property.hoaFees}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Utilities:</span>
                        <span className="text-white">{property.utilities}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Nearby Amenities */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Nearby Amenities</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-yellow-500 font-medium mb-2">Attractions</h4>
                      <div className="space-y-1">
                        {property.nearby.map((item, index) => (
                          <div key={index} className="text-gray-300 text-sm">• {item}</div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-yellow-500 font-medium mb-2">Schools</h4>
                      <div className="space-y-1">
                        {property.schools.map((school, index) => (
                          <div key={index} className="text-gray-300 text-sm">• {school}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <Card className="border-gray-800 bg-gray-900/80 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white">Property Price</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                    {property.price}
                  </div>
                  <div className="text-lg text-gray-300">≈ ${usdValue.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">Last sale: {property.lastSale}</div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Owner:</span>
                    <span className="text-white">{property.owner}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Views:</span>
                    <span className="text-white">{property.views}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <Badge className="bg-green-600 text-white">{property.status}</Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold">
                    Make Offer
                  </Button>
                  <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-800">
                    Contact Owner
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Blockchain Info */}
            <Card className="border-gray-800 bg-gray-900/80 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white">Blockchain Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Token ID:</span>
                    <span className="text-white">{property.tokenId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Smart Contract:</span>
                    <Badge className="bg-green-600 text-white">Active</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">AI Validation:</span>
                    <Badge className="bg-yellow-600 text-black">Verified</Badge>
                  </div>
                </div>
                
                <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                  <div className="text-yellow-400 text-sm font-medium mb-1">Security Features</div>
                  <div className="text-xs text-gray-300 space-y-1">
                    <div>• Fraud detection active</div>
                    <div>• Ownership verification</div>
                    <div>• Transaction history</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Market Analysis */}
            <Card className="border-gray-800 bg-gray-900/80 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white">Market Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Price per sq ft</span>
                    <span className="text-white font-medium">${(usdValue / parseInt(property.sqft.replace(',', ''))).toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Market trend</span>
                    <div className="flex items-center text-green-500">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      +5.2%
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Days on market</span>
                    <span className="text-white font-medium">12</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail; 