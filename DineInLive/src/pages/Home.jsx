import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Home = () => {
  const [location, setLocation] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?location=${encodeURIComponent(location)}`);
  };

  const cards = [
    { to: '/search', title: 'Search Mess', sub: 'Find the best mess near you', emoji: '🔍' },
    { to: '/favorites', title: 'Favourites', sub: 'Your saved places', emoji: '❤️' },
    { to: '/search', title: 'Tiffin Time', sub: 'Tiffin that hits the spot!', emoji: '🥡' },
    { to: '/history', title: 'Order History', sub: 'Track your past orders', emoji: '📋' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#8B5A2B] bg-[url('/thali.jpg')] bg-cover bg-fixed bg-center">
      <Header />

      <div className="flex-1 flex flex-col items-center px-4 py-12 backdrop-blur-sm text-center">
        <h1 className="text-white text-3xl sm:text-4xl font-bold mb-3 drop-shadow-md">
          Get Live Mess Updates
        </h1>
        <p className="text-white/80 text-base sm:text-lg mb-8 max-w-md">
          Discover nearby mess services and daily tiffin providers in real time.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row justify-center mb-10 w-full max-w-xl gap-2 sm:gap-0">
          <input
            type="text"
            placeholder="Enter your location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="flex-1 p-3 text-base sm:text-lg border border-[#D2691E] sm:rounded-l-md rounded-md sm:rounded-none focus:outline-none focus:ring-2 focus:ring-[#8B4513] bg-white"
            required
          />
          <button
            type="submit"
            className="bg-[#D2691E] text-white font-bold px-6 py-3 rounded-md sm:rounded-l-none sm:rounded-r-md hover:bg-[#8B4513] transition-colors duration-300"
          >
            Search
          </button>
        </form>

        {/* Services Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-4xl px-2">
          {cards.map((item, index) => (
            <Link
              key={index}
              to={item.to}
              className="block bg-white text-[#5C2E00] p-5 sm:p-6 rounded-xl shadow-lg transform transition duration-300 hover:scale-105 hover:bg-[#D2691E] hover:text-white group no-underline"
            >
              <div className="text-3xl mb-2">{item.emoji}</div>
              <h3 className="text-base sm:text-lg font-bold mb-1">{item.title}</h3>
              <p className="text-xs sm:text-sm group-hover:text-white/90">{item.sub}</p>
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;