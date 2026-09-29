import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Home = () => {
  const [location, setLocation] = useState('');
  const [messes, setMesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // Fetch up to 20 messes for Home page
  useEffect(() => {
    const fetchMesses = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/messes`,
          {
            params: {
              limit: 9
            },
            withCredentials: true
          }
        );

        setMesses(response.data.messes);

      } catch (err) {
        console.error('Error fetching messes:', err);

        setError('Could not load messes.');
      } finally {
        setLoading(false);
      }
    };

    fetchMesses();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();

    navigate(
      `/search?location=${encodeURIComponent(location)}`
    );
  };

  const cards = [
    {
      to: '/search',
      title: 'Search Mess',
      sub: 'Find the best mess near you',
      emoji: '🔍'
    },
    {
      to: '/favorites',
      title: 'Favourites',
      sub: 'Your saved places',
      emoji: '❤️'
    },
    {
      to: '/search',
      title: 'Tiffin Time',
      sub: 'Tiffin that hits the spot!',
      emoji: '🥡'
    },
    {
      to: '/history',
      title: 'Order History',
      sub: 'Track your past orders',
      emoji: '📋'
    }
  ];

  return (
    <div className="flex-1 ">

      <Header />

      <div className="flex flex-col bg-[url('/hero-bg.jpg')] bg-cover bg-center py-10 text-center items-center">
          {/* Hero Section */}
        
        <div>
          <h1 className="text-[#b4adad] text-xl sm:text-5xl font-bold mb-3 ">
            Get Live Mess Updates
          </h1>
        </div>
        

        <p className="text-[#64748B] text-base sm:text-2xl mb-8 max-w-md">
          Discover nearby mess services and daily tiffin providers in real time.
        </p>

        {/* Search Bar */}

        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row justify-center mb-16 w-[90%] sm:w-full max-w-xl gap-2 sm:gap-0"
        >
          <input
            type="text"
            placeholder="Enter your area or mess name..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="flex-1 p-3 text-base sm:text-lg border border-[#0F0F0f] sm:rounded-l-md rounded-md sm:rounded-none focus:outline-none focus:ring-1  bg-white"
            required
          />

          <button
            type="submit"
            className="bg-[#151720] text-white font-bold px-6 py-3 rounded-md sm:rounded-l-none sm:rounded-r-md "
          >
            Search
          </button>
        </form>
      </div>

      <div className="flex-1 flex flex-col items-center px-4 py-12 text-center">

        {/* Best / Featured Messes */}

        <div className="w-full max-w-6xl mb-12">

          <h2 className="text-[#0F0F0F] text-2xl sm:text-3xl font-bold mb-6">
            Explore Messes
          </h2>

          {/* Loading */}

          {loading && (
            <div className="flex flex-col items-center gap-3 py-10">
              <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>

              <p className="text-[#0F0F0F] font-medium">
                Loading messes...
              </p>
            </div>
          )}

          {/* Error */}

          {!loading && error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md mx-auto">
              {error}
            </div>
          )}

          {/* Mess Grid */}

          {!loading && !error && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                {messes.map((mess) => (
                  <Link
                    key={mess._id}
                    to={`/mess/${mess._id}`}
                    className="block bg-white border border-gray-200 rounded-lg overflow-hidden text-left no-underline shadow-sm  hover:shadow-lg transition-shadow duration-200"
                  >

                    <div className="h-36 bg-[#F1F5F9] flex items-center justify-center overflow-hidden">
                      {mess.bannerImage ? (
                        <img
                          src={mess.bannerImage}
                          alt={mess.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-5xl">
                          🍽
                        </span>
                      )}
                    </div>

                    <div className="p-4">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-[#0F0F0F] mb-1">
                            {mess.name}
                          </h3>

                          <p className="text-gray-500 text-sm mb-2">
                            {mess.location}
                          </p>
                        </div>

                        <div className="flex items-center">
                          <span className="text-sm font-medium text-[#734d0f]">
                            ⭐ {mess.rating || 0.0}
                          </span>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 font-medium text-gray-500 text-xs mt-2 pt-2">
                        ₹0 Delivery, ₹0 Packaging, ₹0 Platform Fees.
                      </div>

                    </div>

                  </Link>

                  
                ))}

              </div>

              {/* No Messes */}

              {messes.length === 0 && (
                <div className="bg-white/90 rounded-xl p-8 max-w-md mx-auto">
                  <p className="text-2xl mb-2">
                    🍽
                  </p>

                  <p className="text-xl text-[#5C2E00] font-bold">
                    No messes available yet
                  </p>

                  <p className="text-gray-500 mt-2">
                    Check back soon for available messes.
                  </p>
                </div>
              )}

            </>
          )}

        </div>

        {/* Services Grid */}

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-4xl px-2">

          {cards.map((item, index) => (
            <Link
              key={index}
              to={item.to}
              className="block bg-white border border-gray-200 text-[#0F0F0F] p-5 sm:p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 no-underline"
            >

              <div className="text-3xl mb-2">
                {item.emoji}
              </div>

              <h3 className="text-base sm:text-lg font-bold mb-1">
                {item.title}
              </h3>

              <p className="text-xs sm:text-sm group-hover:text-[#0F0F0F]/90">
                {item.sub}
              </p>

            </Link>
          ))}

        </div>

      </div>

      <Footer />

    </div>
  );
};

export default Home;