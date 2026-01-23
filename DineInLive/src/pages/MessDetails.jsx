import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const MessDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [mess, setMess] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  
  // New State for Favorite
  const [isFavorite, setIsFavorite] = useState(false);

  // Fetch mess details
  useEffect(() => {
    fetch(`http://localhost:5000/api/messes/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setMess(data);
        setLoading(false);
        checkIfFavorite(data._id || id); // Check if already favorite
      })
      .catch(() => setLoading(false));
  }, [id]);

  // Check LocalStorage on load
  const checkIfFavorite = (messId) => {
    const favorites = JSON.parse(localStorage.getItem("userFavorites") || "[]");
    const exists = favorites.find((fav) => fav.id === messId);
    setIsFavorite(!!exists);
  };

  // Toggle Favorite Logic
  const toggleFavorite = () => {
    let favorites = JSON.parse(localStorage.getItem("userFavorites") || "[]");
    
    if (isFavorite) {
      // Remove from favorites
      favorites = favorites.filter((fav) => fav.id !== (mess._id || id));
      alert("Removed from Favorites");
    } else {
      // Add to favorites (Save minimal details to avoid re-fetching on the Favorites page)
      const newFav = {
        id: mess._id || id,
        name: mess.name,
        location: mess.location,
        image: "https://images.unsplash.com/photo-1543353071-87d98dec2144?q=80&w=2070&auto=format&fit=crop" // Use dynamic image if available
      };
      favorites.push(newFav);
      alert("Added to Favorites!");
    }

    localStorage.setItem("userFavorites", JSON.stringify(favorites));
    setIsFavorite(!isFavorite);
  };

  const addToCart = (item) => {
    setCart((prev) => [...prev, { ...item, quantity: 1 }]);
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const placeOrder = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    await fetch("http://localhost:5000/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        messId: mess._id,
        messName: mess.name,
        items: cart,
        totalAmount
      })
    });

    alert("Order placed successfully!");
    navigate("/orders");
  };

  if (loading) return <div className="h-screen flex items-center justify-center text-xl">Loading...</div>;
  if (!mess) return <p className="text-center mt-20">Mess not found</p>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      {/* Hero / Banner Section (Updated from previous request) */}
      <div className="relative h-64 bg-gray-800">
         <img 
            src="https://images.unsplash.com/photo-1543353071-87d98dec2144?q=80&w=2070&auto=format&fit=crop" 
            alt="Mess Banner" 
            className="w-full h-full object-cover opacity-60"
         />
         <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
             <div className="container mx-auto flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-bold mb-1">{mess.name}</h2>
                    <p className="text-lg opacity-90">📍 {mess.location}</p>
                    {/* Google Maps Link */}
                    {mess.fullAddress && (
                        <a 
                           href={mess.fullAddress.startsWith('http') ? mess.fullAddress : `https://maps.google.com/?q=${mess.fullAddress}`}
                           target="_blank" rel="noreferrer"
                           className="text-orange-300 hover:text-orange-400 text-sm underline"
                        >
                            View on Map
                        </a>
                    )}
                </div>
                
                {/* FAVORITE BUTTON */}
                <button 
                    onClick={toggleFavorite}
                    className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold transition shadow-lg ${
                        isFavorite 
                        ? "bg-white text-red-500 hover:bg-gray-100" 
                        : "bg-red-500 text-white hover:bg-red-600"
                    }`}
                >
                    <span className="text-2xl">{isFavorite ? "♥" : "♡"}</span>
                    {isFavorite ? "Favorited" : "Add to Favorites"}
                </button>
             </div>
         </div>
      </div>

      <div className="flex-1 container mx-auto p-6 max-w-5xl">
        <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Menu Section */}
            <div className="flex-1">
                <h3 className="text-2xl font-bold text-[#5C2E00] mb-4 border-b border-[#D2691E] pb-2">Menu</h3>
                {mess.menuItems?.length > 0 ? (
                <div className="space-y-4">
                    {mess.menuItems.map((item, index) => (
                    <div key={index} className="bg-white p-4 rounded-xl shadow-md border border-gray-100 flex justify-between items-center hover:shadow-lg transition">
                        <div>
                        <h4 className="font-bold text-lg text-[#3B1E00]">{item.name}</h4>
                        <p className="text-sm text-gray-500">{item.contents}</p>
                        </div>
                        <div className="text-right">
                        <p className="font-bold text-[#D2691E] text-lg">₹{item.price}</p>
                        <button
                            onClick={() => addToCart(item)}
                            className="mt-2 bg-[#5C2E00] text-white px-5 py-1.5 rounded-lg hover:bg-[#3B1E00] text-sm"
                        >
                            Add +
                        </button>
                        </div>
                    </div>
                    ))}
                </div>
                ) : (
                <p>No menu items added yet.</p>
                )}
            </div>

            {/* Cart Section */}
            {cart.length > 0 && (
                <div className="lg:w-1/3">
                    <div className="bg-white p-6 rounded-xl shadow-xl border-t-4 border-[#D2691E] sticky top-4">
                        <h3 className="text-xl font-bold mb-4 text-[#5C2E00]">Your Order</h3>
                        <div className="max-h-60 overflow-y-auto space-y-2 mb-4">
                            {cart.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm border-b pb-1">
                                <span>{item.name}</span>
                                <span className="font-bold">₹{item.price}</span>
                            </div>
                            ))}
                        </div>
                        <div className="flex justify-between font-bold text-lg text-[#D2691E] border-t pt-2">
                            <span>Total:</span>
                            <span>₹{totalAmount}</span>
                        </div>
                        <button
                        onClick={placeOrder}
                        className="w-full mt-4 bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 shadow-md transition transform hover:scale-105"
                        >
                        Place Order
                        </button>
                    </div>
                </div>
            )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MessDetails;