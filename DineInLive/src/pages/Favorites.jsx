import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    // Load favorites from LocalStorage
    const storedFavs = JSON.parse(localStorage.getItem('userFavorites') || '[]');
    setFavorites(storedFavs);
  }, []);

  const removeFavorite = (id) => {
    const updatedFavs = favorites.filter(fav => fav.id !== id);
    setFavorites(updatedFavs);
    localStorage.setItem('userFavorites', JSON.stringify(updatedFavs));
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-[#3B1E00] bg-gray-50">
      <Header />

      <div className="flex-1 container mx-auto p-6 max-w-6xl">
        <h2 className="text-3xl font-bold text-[#5C2E00] mb-8 text-center border-b pb-4">
          ❤️ My Favorite Messes
        </h2>

        {favorites.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-2xl text-gray-400 font-bold mb-4">No favorites yet!</h3>
            <p className="text-gray-500 mb-6">Go explore and save some delicious places.</p>
            <Link 
              to="/search" 
              className="px-6 py-3 bg-[#D2691E] text-white rounded-lg hover:bg-[#8B4513] transition font-bold"
            >
              Browse Messes
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favorites.map((mess) => (
              <div 
                key={mess.id} 
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition transform hover:-translate-y-1"
              >
                {/* Image */}
                <div className="h-48 overflow-hidden relative">
                   <img 
                     src={mess.image || "https://images.unsplash.com/photo-1543353071-87d98dec2144?q=80&w=2070&auto=format&fit=crop"} 
                     alt={mess.name} 
                     className="w-full h-full object-cover"
                   />
                   <button 
                     onClick={(e) => {
                        e.preventDefault();
                        removeFavorite(mess.id);
                     }}
                     className="absolute top-2 right-2 bg-white/90 p-2 rounded-full text-red-500 hover:text-red-700 shadow-sm"
                     title="Remove from favorites"
                   >
                     ✖
                   </button>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-xl font-bold text-[#5C2E00] mb-1">{mess.name}</h3>
                  <p className="text-gray-600 mb-4 text-sm">📍 {mess.location}</p>
                  
                  <Link 
                    to={`/mess/${mess.id}`} 
                    className="block w-full text-center py-2 bg-[#5C2E00] text-white font-bold rounded hover:bg-[#3B1E00] transition"
                  >
                    View Menu & Order
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Favorites;