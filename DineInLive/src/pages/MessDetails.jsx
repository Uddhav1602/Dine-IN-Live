import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";

const MessDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [mess, setMess] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [orderStatus, setOrderStatus] = useState(""); // "", "loading", "success", "error"

  useEffect(() => {
    const fetchMess = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/messes/${id}`
        );

        setMess(res.data);
        setLoading(false);
        checkIfFavorite(res.data._id || id);

      } catch (err) {
        setLoading(false);
      }
    };

    fetchMess();
  }, [id]);

  const checkIfFavorite = (messId) => {
    const favorites = JSON.parse(
      localStorage.getItem("userFavorites") || "[]"
    );

    setIsFavorite(
      favorites.some((fav) => fav.id === messId)
    );
  };

  const toggleFavorite = () => {
    let favorites = JSON.parse(
      localStorage.getItem("userFavorites") || "[]"
    );

    if (isFavorite) {
      favorites = favorites.filter(
        (fav) => fav.id !== (mess._id || id)
      );
    } else {
      favorites.push({
        id: mess._id || id,
        name: mess.name,
        location: mess.location,
        image: null,
      });
    }

    localStorage.setItem(
      "userFavorites",
      JSON.stringify(favorites)
    );

    setIsFavorite(!isFavorite);
  };

  // --- Cart: de-duplicate by incrementing quantity ---
  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find(
        (c) => c._id === item._id || c.name === item.name
      );

      if (existing) {
        return prev.map((c) =>
          c.name === item.name
            ? {
                ...c,
                quantity: c.quantity + 1,
              }
            : c
        );
      }

      return [
        ...prev,
        {
          ...item,
          quantity: 1,
        },
      ];
    });
  };

  const removeFromCart = (itemName) => {
    setCart((prev) =>
      prev.filter((c) => c.name !== itemName)
    );
  };

  const totalAmount = cart.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );

  const placeOrder = async () => {
    if (cart.length === 0) return;

    setOrderStatus("loading");

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/orders`,
        {
          messId: mess._id,
          messName: mess.name,
          items: cart,
          totalAmount,
        },
        {
          withCredentials: true,
        }
      );

      setOrderStatus("success");
      setCart([]);

      setTimeout(() => navigate("/orders"), 1500);

    } catch (err) {
      console.error("Order error:", err);

      setOrderStatus("error");

      setTimeout(() => setOrderStatus(""), 3000);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center flex-col gap-4">
        <div className="w-12 h-12 border-4 border-[#D2691E] border-t-transparent rounded-full animate-spin"></div>

        <p className="text-gray-600">
          Loading mess details...
        </p>
      </div>
    );
  }

  if (!mess) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <p className="text-2xl font-bold text-[#5C2E00] mb-4">
          Mess not found
        </p>

        <button
          onClick={() => navigate("/search")}
          className="bg-[#D2691E] text-white px-6 py-2 rounded-lg hover:bg-[#8B4513] transition"
        >
          Back to Search
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      {/* Hero Banner */}
      <div className="relative h-48 sm:h-64 bg-gradient-to-br from-[#8B5A2B] to-[#5C2E00]">

        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-7xl sm:text-8xl opacity-20">
            🍽
          </span>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-4 sm:p-6 bg-gradient-to-t from-black/80 to-transparent text-white">

          <div className="container mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">

            <div>
              <h1 className="text-2xl sm:text-4xl font-bold mb-1">
                {mess.name}
              </h1>

              <p className="text-base sm:text-lg opacity-90">
                📍 {mess.location}
              </p>

              {mess.googleMapsLink && (
                <a
                  href={mess.googleMapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-300 hover:text-orange-400 text-sm underline"
                >
                  View on Map ↗
                </a>
              )}
            </div>

            <button
              onClick={toggleFavorite}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition shadow-lg text-sm sm:text-base ${
                isFavorite
                  ? "bg-white text-red-500 hover:bg-gray-100"
                  : "bg-red-500 text-white hover:bg-red-600"
              }`}
            >
              <span className="text-xl">
                {isFavorite ? "♥" : "♡"}
              </span>

              {isFavorite
                ? "Favorited"
                : "Add to Favorites"}
            </button>

          </div>
        </div>
      </div>

      <div className="flex-1 container mx-auto px-4 py-6 max-w-5xl">

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Menu Section */}
          <div className="flex-1">

            <h2 className="text-2xl font-bold text-[#5C2E00] mb-4 border-b-2 border-[#D2691E] pb-2">
              Menu
            </h2>

            {mess.menuItems?.length > 0 ? (

              <div className="space-y-3">

                {mess.menuItems.map((item, index) => (

                  <div
                    key={index}
                    className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center hover:shadow-md transition"
                  >

                    <div className="flex-1 mr-4">

                      <h4 className="font-bold text-base sm:text-lg text-[#3B1E00]">
                        {item.name}
                      </h4>

                      {item.contents &&
                        item.contents !== "Single Item" && (
                          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                            {item.contents}
                          </p>
                        )}

                    </div>

                    <div className="text-right shrink-0">

                      <p className="font-bold text-[#D2691E] text-base sm:text-lg">
                        ₹{item.price}
                      </p>

                      <button
                        onClick={() => addToCart(item)}
                        className="mt-1.5 bg-[#5C2E00] text-white px-4 py-1 rounded-lg hover:bg-[#3B1E00] text-sm transition"
                      >
                        Add +
                      </button>

                    </div>

                  </div>

                ))}

              </div>

            ) : (

              <div className="text-center py-12 text-gray-400">
                <p className="text-4xl mb-3">🍽</p>

                <p className="font-medium">
                  No menu items added yet.
                </p>
              </div>

            )}

          </div>

          {/* Cart Section */}
          {cart.length > 0 && (

            <div className="lg:w-80">

              <div className="bg-white p-5 rounded-xl shadow-xl border-t-4 border-[#D2691E] sticky top-4">

                <h3 className="text-xl font-bold mb-4 text-[#5C2E00]">
                  Your Order
                </h3>

                {/* Order status feedback */}
                {orderStatus === "success" && (
                  <div className="bg-green-100 text-green-700 text-sm px-3 py-2 rounded-lg mb-3 text-center font-medium">
                    ✅ Order placed! Redirecting...
                  </div>
                )}

                {orderStatus === "error" && (
                  <div className="bg-red-100 text-red-700 text-sm px-3 py-2 rounded-lg mb-3 text-center font-medium">
                    ❌ Order failed. Please try again.
                  </div>
                )}

                <div className="max-h-60 overflow-y-auto space-y-2 mb-4">

                  {cart.map((item) => (

                    <div
                      key={item.name}
                      className="flex justify-between items-center text-sm border-b pb-1.5"
                    >

                      <div>
                        <span className="font-medium">
                          {item.name}
                        </span>

                        <span className="text-gray-400 ml-1 text-xs">
                          x{item.quantity}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">

                        <span className="font-bold">
                          ₹{item.price * item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            removeFromCart(item.name)
                          }
                          className="text-red-400 hover:text-red-600 text-xs"
                        >
                          ✕
                        </button>

                      </div>

                    </div>

                  ))}

                </div>

                <div className="flex justify-between font-bold text-lg text-[#D2691E] border-t pt-3">
                  <span>Total:</span>
                  <span>₹{totalAmount}</span>
                </div>

                <button
                  onClick={placeOrder}
                  disabled={orderStatus === "loading"}
                  className="w-full mt-4 bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 shadow-md transition transform hover:scale-105 disabled:opacity-60 disabled:hover:scale-100"
                >
                  {orderStatus === "loading"
                    ? "Placing Order..."
                    : "Place Order"}
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

