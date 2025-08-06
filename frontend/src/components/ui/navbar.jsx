import React from 'react';
import { Building } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Update path as per your structure
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-black/90 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
                <Building className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-bold text-white">RealEstateChain</span>
            </div>
          </div>
        </div>
      </header>
  );
};

export default Navbar;
