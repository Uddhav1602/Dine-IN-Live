import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header'; // Imported Header
import Footer from '../components/Footer';

const PartnerWithUs = () => {
  const [restaurantId, setRestaurantId] = useState('');
  const navigate = useNavigate();

  const handleContinue = () => {
    if (!restaurantId.trim()) {
      alert('Please enter a Restaurant ID or Mobile Number');
      return;
    }
    // Navigate to the info page with the ID as a URL parameter
    navigate(`/partner-info?restaurantId=${encodeURIComponent(restaurantId)}`);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-[#3B1E00] bg-gradient-to-br from-[#f5e6d0] to-[#e9d8ba]">
      
      {/* Replaced inline code with the Header Component */}
      <Header />

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center w-full max-w-6xl mx-auto px-5 py-10">
        
        {/* Hero Section */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-[#5C2E00] mb-4">Partner with Dine In Live!</h2>
          <p className="text-lg max-w-2xl mx-auto leading-relaxed">
            Join our platform to increase your orders, reach more customers, and grow your restaurant business with our innovative delivery solutions.
          </p>
        </div>

        {/* Get Started Card */}
        <div className="bg-white p-8 w-full max-w-md rounded-xl shadow-[0_8px_20px_rgba(0,0,0,0.15)]">
          <h3 className="text-2xl font-bold text-[#5C2E00] mb-5">Get Started Today</h3>
          
          <div className="mb-5">
            <label htmlFor="restaurant-id" className="block text-left mb-2 font-medium text-[#3B1E00]">
              Restaurant ID or Mobile Number
            </label>
            <input 
              type="text" 
              id="restaurant-id" 
              value={restaurantId}
              onChange={(e) => setRestaurantId(e.target.value)}
              placeholder="Enter your details" 
              className="w-full p-3 rounded-lg border border-[#D2B48C] text-base transition-all duration-300 focus:outline-none focus:border-[#D2691E] focus:ring-2 focus:ring-[#D2691E]/20"
            />
          </div>

          <button 
            onClick={handleContinue}
            className="w-full p-3.5 my-4 bg-[#D2691E] text-white font-bold text-base rounded-lg border-none cursor-pointer transition-all duration-300 hover:bg-[#BD5E1D] hover:-translate-y-0.5 hover:shadow-lg"
          >
            Continue
          </button>

          <p className="text-sm text-gray-600 mt-4">
            By proceeding, I agree to Dine In Live's <Link to="#" className="text-[#D2691E] no-underline">Terms & Conditions</Link> and <Link to="#" className="text-[#D2691E] no-underline">Privacy Policy</Link>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PartnerWithUs;