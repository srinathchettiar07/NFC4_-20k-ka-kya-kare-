import React from 'react';

const HeroBanner = () => {
  return (
    <section className="relative h-[50vh] bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden flex items-center justify-center">
      {/* Simple Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-24 h-24 bg-yellow-500 rounded-full opacity-10"></div>
        <div className="absolute bottom-20 right-20 w-20 h-20 bg-yellow-400 rounded-full opacity-10"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center space-y-6 px-6 max-w-4xl mx-auto">
        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
          <span className="block">List Your</span>
          <span className="block bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            Property
          </span>
        </h1>

        {/* Description */}
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
          Professional property listings with secure document upload support
        </p>

        {/* CTA Button */}
        <div className="mt-8">
          <button className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold rounded-lg hover:from-yellow-600 hover:to-yellow-700 transform hover:scale-105 transition-all duration-300">
            Get Started
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
