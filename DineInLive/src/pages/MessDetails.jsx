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
  const [orderStatus, setOrderStatus] = useState("");

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

  // --- Cart ---

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

  // --- Loading ---

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center flex-col gap-4">

        <div className="w-10 h-10 border-4 border-gray-300 border-t-[#151720] rounded-full animate-spin"></div>

        <p className="text-gray-600">
          Loading mess details...
        </p>

      </div>
    );
  }

  // --- Mess not found ---

  if (!mess) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">

        <p className="text-2xl font-bold text-[#0F0F0F] mb-4">
          Mess not found
        </p>

        <button
          onClick={() => navigate("/search")}
          className="bg-[#151720] text-white px-5 py-2 rounded-md"
        >
          Back to Search
        </button>

      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">

      <Header />

      {/* Mess Information */}

      <div className="w-full border-b border-gray-200 bg-white">

        <div className="w-[90%] max-w-4xl mx-auto py-6 flex flex-col sm:flex-row justify-between gap-4">

          <div>

            <h1 className="text-2xl sm:text-3xl font-bold text-[#0F0F0F]">
              {mess.name}
            </h1>

            <p className="text-gray-500 text-sm sm:text-base mt-1">
              📍 {mess.location}
            </p>

            {mess.googleMapsLink && (
              <a
                href={mess.googleMapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#151720] text-sm font-medium underline mt-1 inline-block"
              >
                View on Map ↗
              </a>
            )}

          </div>

          <button
            onClick={toggleFavorite}
            className="self-start px-4 py-2 rounded-md font-medium text-sm bg-gray-300 text-red-500"
          >
            {isFavorite
              ? "♥ Favorited"
              : "♡ Add to Favorites"}
          </button>

        </div>

      </div>

      {/* Main Content */}

      <div className="flex-1 w-full max-w-4xl mx-auto px-4 py-6">

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Menu Section */}

          <div
            className={
              cart.length > 0
                ? "flex-1"
                : "w-full max-w-3xl mx-auto"
            }
          >

            <h2 className="text-2xl font-bold text-[#0F0F0F] mb-5">
              Menu
            </h2>

            {mess.menuItems?.length > 0 ? (

              <div className="space-y-3">

                {mess.menuItems.map((item, index) => (

                  <div
                    key={index}
                    className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex justify-between items-center"
                  >

                    {/* Item Information */}

                    <div className="flex-1 mr-4">

                      <h4 className="font-bold text-base sm:text-lg text-[#0F0F0F]">
                        {item.name}
                      </h4>

                      {item.contents &&
                        item.contents !== "Single Item" && (
                          <p className="text-xs sm:text-sm text-gray-500 mt-1">
                            {item.contents}
                          </p>
                        )}

                    </div>

                    {/* Price + Add */}

                    <div className="text-right shrink-0">

                      <p className="font-bold text-[#151720] text-base sm:text-lg">
                        ₹{item.price}
                      </p>

                      <button
                        onClick={() => addToCart(item)}
                        className="mt-2 bg-[#151720] text-white px-4 py-1.5 rounded-md text-sm"
                      >
                        Add +
                      </button>

                    </div>

                  </div>

                ))}

              </div>

            ) : (

              <div className="text-center py-10 text-gray-400">

                <p className="text-4xl mb-3">
                  🍽
                </p>

                <p className="font-medium">
                  No menu items added yet.
                </p>

              </div>

            )}

          </div>

          {/* Cart Section */}

          {cart.length > 0 && (

            <div className="lg:w-80">

              <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 sticky top-4">

                <h3 className="text-xl font-bold mb-4 text-[#0F0F0F]">
                  Your Order
                </h3>

                {/* Order Status */}

                {orderStatus === "success" && (
                  <div className="bg-green-100 text-green-700 text-sm px-3 py-2 rounded-md mb-3 text-center font-medium">
                    ✅ Order placed! Redirecting...
                  </div>
                )}

                {orderStatus === "error" && (
                  <div className="bg-red-100 text-red-700 text-sm px-3 py-2 rounded-md mb-3 text-center font-medium">
                    ❌ Order failed. Please try again.
                  </div>
                )}

                {/* Cart Items */}

                <div className="max-h-60 overflow-y-auto space-y-2 mb-4">

                  {cart.map((item) => (

                    <div
                      key={item.name}
                      className="flex justify-between items-center text-sm border-b pb-2"
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
                          className="text-red-400 text-xs"
                        >
                          ✕
                        </button>

                      </div>

                    </div>

                  ))}

                </div>

                {/* Total */}

                <div className="flex justify-between font-bold text-lg text-[#0F0F0F] border-t pt-3">

                  <span>
                    Total:
                  </span>

                  <span>
                    ₹{totalAmount}
                  </span>

                </div>

                {/* Place Order */}

                <button
                  onClick={placeOrder}
                  disabled={orderStatus === "loading"}
                  className="w-full mt-4 bg-[#151720] text-white font-bold py-3 rounded-md disabled:opacity-60"
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