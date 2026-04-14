import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";

const SearchMess = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [messes, setMesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/messes")
      .then((res) => {
        if (!res.ok) throw new Error("Server error");
        return res.json();
      })
      .then((data) => {
        setMesses(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching messes:", err);
        setError("Could not load messes. Please check that the backend is running.");
        setLoading(false);
      });
  }, []);

  const filteredMesses = messes.filter(
    (mess) =>
      mess.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mess.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#8B5A2B] bg-[url('/thali.jpg')] bg-cover bg-fixed">
      <Header />

      <div className="flex-1 flex flex-col items-center px-4 py-8 bg-white/60 backdrop-blur-sm text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#5C2E00] mb-6">
          Find the Best Mess Near You!
        </h1>

        {/* Search Bar */}
        <div className="w-full max-w-lg mb-8">
          <input
            type="text"
            placeholder="Search by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 rounded-lg border border-[#D2691E] focus:outline-none focus:ring-2 focus:ring-[#8B4513] bg-white shadow-sm"
          />
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center gap-3 py-10">
            <div className="w-10 h-10 border-4 border-[#D2691E] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[#5C2E00] font-medium">Loading messes...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 max-w-md">
            {error}
          </div>
        )}

        {/* Mess Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-6xl">
            {filteredMesses.map((mess) => (
              <div
                key={mess._id}
                className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <div className="h-40 bg-gradient-to-br from-[#D2691E] to-[#8B4513] flex items-center justify-center">
                  <span className="text-5xl">🍽</span>
                </div>

                <div className="p-4 text-left">
                  <h3 className="text-lg font-bold text-[#5C2E00] mb-1">
                    <Link to={`/mess/${mess._id}`} className="hover:text-[#D2691E] transition">
                      {mess.name}
                    </Link>
                  </h3>
                  <p className="text-gray-500 text-sm mb-2">📍 {mess.location}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-amber-600">{mess.rating || 4.0} ⭐</span>
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

            {filteredMesses.length === 0 && (
              <div className="col-span-full py-16 text-center">
                <p className="text-2xl mb-2">🍽</p>
                <p className="text-xl text-[#5C2E00] font-bold">No mess found</p>
                <p className="text-gray-500 mt-2">Try a different name or location.</p>
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
