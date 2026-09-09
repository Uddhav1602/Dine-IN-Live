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
              limit: 8
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
    <div className="flex flex-col min-h-screen bg-[#803e05] bg-[url('/thali.jpg')] bg-cover bg-fixed bg-center">

      <Header />

      <div className="flex-1 flex flex-col items-center px-4 py-12 backdrop-blur-sm text-center">

        {/* Hero Section */}

        <h1 className="text-white text-3xl sm:text-4xl font-bold mb-3 drop-shadow-md">
          Get Live Mess Updates
        </h1>

        <p className="text-white/80 text-base sm:text-lg mb-8 max-w-md">
          Discover nearby mess services and daily tiffin providers in real time.
        </p>

        {/* Search Bar */}

        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row justify-center mb-10 w-full max-w-xl gap-2 sm:gap-0"
        >
          <input
            type="text"
            placeholder="Enter your area or mess name..."
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

        {/* Best / Featured Messes */}

        <div className="w-full max-w-6xl mb-12">

          <h2 className="text-white text-2xl sm:text-3xl font-bold mb-6 drop-shadow-md">
            Explore Messes
          </h2>

          {/* Loading */}

          {loading && (
            <div className="flex flex-col items-center gap-3 py-10">
              <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>

              <p className="text-white font-medium">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                {messes.map((mess) => (
                  <div
                    key={mess._id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl text-left"
                  >

                    {/* Mess Image Placeholder */}

                    <div className="h-36 bg-gradient-to-br from-[#D2691E] to-[#8B4513] flex items-center justify-center">
                      <span className="text-5xl">
                        🍽
                      </span>
                    </div>

                    {/* Mess Information */}

                    <div className="p-4">

                      <h3 className="text-lg font-bold text-[#5C2E00] mb-1">
                        <Link
                          to={`/mess/${mess._id}`}
                          className="hover:text-[#D2691E] transition"
                        >
                          {mess.name}
                        </Link>
                      </h3>

                      <p className="text-gray-500 text-sm mb-2">
                        📍 {mess.location}
                      </p>

                      <div className="flex items-center justify-between">

                        <span className="text-sm font-medium text-amber-600">
                          {mess.rating || 4.0} ⭐
                        </span>

                        <Link
                          to={`/mess/${mess._id}`}
                          className="text-sm bg-[#5C2E00] text-white px-3 py-1 rounded-full hover:bg-[#3B1E00] transition no-underline"
                        >
                          View Menu
                        </Link>

                      </div>

                    </div>

                  </div>
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
              className="block bg-white text-[#5C2E00] p-5 sm:p-6 rounded-xl shadow-lg transform transition duration-300 hover:scale-105 hover:bg-[#D2691E] hover:text-white group no-underline"
            >

              <div className="text-3xl mb-2">
                {item.emoji}
              </div>

              <h3 className="text-base sm:text-lg font-bold mb-1">
                {item.title}
              </h3>

              <p className="text-xs sm:text-sm group-hover:text-white/90">
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