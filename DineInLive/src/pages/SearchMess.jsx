import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";

const SearchMess = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [messes, setMesses] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch messes from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/messes")
      .then((res) => res.json())
      .then((data) => {
        setMesses(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching messes:", err);
        setLoading(false);
      });
  }, []);

  // 🔹 Search filter
  const filteredMesses = messes.filter(
    (mess) =>
      mess.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mess.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#8B5A2B] bg-[url('/thali.jpg')] bg-cover bg-fixed text-center">
      <Header />

      <div className="flex-1 flex flex-col items-center p-8 bg-white/60 backdrop-blur-sm">
        <h2 className="text-3xl font-bold text-[#5C2E00] mb-6">
          Find the best mess near you!
        </h2>

        {/* 🔍 Search Bar */}
        <div className="flex justify-center w-full max-w-lg mb-10">
          <input
            type="text"
            placeholder="Search your choice..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 rounded-md border border-[#D2691E] focus:outline-none focus:ring-2 focus:ring-[#8B4513]"
          />
        </div>

        {/* ⏳ Loading */}
        {loading && (
          <p className="text-xl font-bold text-[#5C2E00]">Loading messes...</p>
        )}

        {/* 🏠 Mess Grid */}
        <div className="flex flex-wrap justify-center gap-6 w-full max-w-6xl">
          {!loading &&
            filteredMesses.map((mess) => (
              <div
                key={mess._id}
                className="bg-white p-4 rounded-xl shadow-lg w-64 transform transition duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <img
                  src="/default-restaurant.jpg"
                  alt={mess.name}
                  className="w-full h-40 object-cover rounded-md mb-4"
                />

                <h3 className="text-xl font-bold text-[#5C2E00] mb-2">
                  <Link
                    to={`/mess/${mess._id}`}
                    className="hover:underline"
                  >
                    {mess.name}
                  </Link>
                </h3>

                <p className="text-gray-700 font-semibold">
                  {mess.rating || 4.0} ⭐ | 30–40 mins
                </p>

                <p className="text-gray-600">{mess.location}</p>
              </div>
            ))}

          {!loading && filteredMesses.length === 0 && (
            <p className="text-xl text-[#5C2E00] font-bold">
              No mess found matching your search.
            </p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SearchMess;
