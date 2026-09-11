import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Footer from '../components/Footer';
import Header from '../components/Header';

const SearchMess = () => {
  const [searchParams] = useSearchParams();

  const initialSearch = searchParams.get('location') || '';

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [messes, setMesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchMesses = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/messes`,
          {
            params: {
              search: searchTerm,
              page,
              limit: 10,
            },
            withCredentials: true,
          }
        );

        setMesses(response.data.messes);
        setTotalPages(response.data.totalPages);

      } catch (err) {
        console.error('Error fetching messes:', err);

        setError(
          'Could not load messes. Please check that the backend is running.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMesses();
  }, [searchTerm, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  const handlePrevious = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">

      <Header />

      <div className="flex-1 flex flex-col items-center px-4 py-10 text-center">

        {/* Search Heading */}

        <h1 className="text-[#0F0F0F] text-2xl sm:text-3xl font-bold mb-6">
          Find the Best Mess Near You!
        </h1>

        {/* Search Bar */}

        <form
          onSubmit={handleSearch}
          className="flex w-[90%] sm:w-full max-w-xl mb-10 gap-2"
        >

          <input
            type="text"
            placeholder="Search by mess name or area..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 p-3 text-base sm:text-lg border border-gray-300 rounded-md focus:outline-none bg-white"
          />

          <button
            type="submit"
            className="bg-[#151720] text-white font-bold px-5 py-3 rounded-md"
          >
            Search
          </button>

        </form>

        {/* Loading */}

        {loading && (
          <div className="flex flex-col items-center gap-3 py-10">

            <div className="w-10 h-10 border-4 border-gray-300 border-t-[#151720] rounded-full animate-spin"></div>

            <p className="text-[#0F0F0F] font-medium">
              Loading messes...
            </p>

          </div>
        )}

        {/* Error */}

        {!loading && error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
            {error}
          </div>
        )}

        {/* Mess Grid */}

        {!loading && !error && (
          <div className="w-full max-w-6xl">

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

              {messes.map((mess) => (
                <Link
                  key={mess._id}
                  to={`/mess/${mess._id}`}
                  className="block bg-white border border-gray-200 rounded-lg overflow-hidden text-left no-underline shadow-sm hover:shadow-lg transition-shadow duration-200"
                >

                  {/* Image */}

                  <div className="h-36 bg-[#F1F5F9] flex items-center justify-center">
                    <span className="text-5xl">
                      🍽
                    </span>
                  </div>

                  {/* Mess Information */}

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
              <div className="py-16 text-center">

                <p className="text-2xl mb-2">
                  🍽
                </p>

                <p className="text-xl text-[#0F0F0F] font-bold">
                  No mess found
                </p>

                <p className="text-gray-500 mt-2">
                  Try a different name or area.
                </p>

              </div>
            )}

            {/* Pagination */}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-10">

                <button
                  onClick={handlePrevious}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-md bg-[#151720] text-white disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  ← Previous
                </button>

                <span className="font-medium text-gray-600">
                  Page {page} of {totalPages}
                </span>

                <button
                  onClick={handleNext}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-md bg-[#151720] text-white disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next →
                </button>

              </div>
            )}

          </div>
        )}

      </div>

      <Footer />

    </div>
  );
};

export default SearchMess;