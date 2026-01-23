import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Ensure you have configured your Tailwind to handle background images or use inline style for dynamic URLs
// For this example, we assume the image is in the public folder.

const Home = () => {
  const [location, setLocation] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?location=${location}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#8B5A2B] bg-[url('/thali.jpg')] bg-cover bg-fixed bg-center text-center">
      {/* Overlay: We use an absolute div or a wrapper with bg-opacity. 
          Here we apply a semi-transparent white overlay to the main content wrapper. */}
      
      <Header />

      <div className="flex-1 flex flex-col items-center p-12 backdrop-blur-sm">
        <h2 className="text-white text-3xl font-bold mb-8 drop-shadow-md">
          Get the live mess updates... Mess it up your way!!
        </h2>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex justify-center mb-8 w-full max-w-lg">
          <input 
            type="text" 
            placeholder="Enter your live location..." 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-3 text-lg border border-[#D2691E] rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#8B4513]"
            required 
          />
          <button 
            type="submit" 
            className="bg-[#D2691E] text-white font-bold px-6 py-3 rounded-r-md hover:bg-[#8B4513] transition-colors duration-300"
          >
            Search
          </button>
        </form>

        {/* Services Grid */}
        <div className="flex flex-wrap justify-center gap-4">
          {/* Reusable Card Component */}
          {[
            { to: '/search', title: 'SEARCH MESS', sub: '"Tiffin that hits the spot!"' },
            { to: '/favorites', title: 'FAVOURITE', sub: 'Your choice...' },
            { to: '/tiffin', title: 'TIFFIN TIME', sub: '"Tiffin that hits the spot!"' },
            { to: '/history', title: 'HISTORY', sub: 'Your searches...' }
          ].map((item, index) => (
            <Link 
              key={index}
              to={item.to} 
              className="block bg-white text-[#5C2E00] p-6 rounded-xl shadow-lg w-64 transform transition duration-300 hover:scale-105 hover:bg-[#D2691E] hover:text-white group no-underline"
            >
              <h3 className="text-xl font-bold mb-2 group-hover:text-white">{item.title}</h3>
              <p className="group-hover:text-white">{item.sub}</p>
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;