import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/users/me`,
          {
            withCredentials: true,
          }
        );

        setUser(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);

        if (err.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      );

      // Authentication cookie is cleared by the backend.
      navigate("/login");
    } catch (err) {
      console.error(
        "Logout failed:",
        err.response?.data?.error || err.message
      );
    }
  };

  if (loading)
    return <div className="text-center mt-20">Loading profile...</div>;

  return (
    <div className="flex flex-col min-h-screen bg-[#FDF5E6] font-sans">
      <Header />

      <div className="flex-1 flex justify-center items-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-[#D2691E]">
          
          {/* Avatar / Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-[#D2691E] rounded-full flex items-center justify-center text-white text-4xl font-bold">
              {user?.username?.charAt(0).toUpperCase() || "U"}
            </div>
          </div>

          <h2 className="text-3xl text-center text-[#5C2E00] font-bold mb-2">
            {user?.username}
          </h2>

          <p className="text-center text-gray-500 mb-8">
            {user?.email}
          </p>

          {/* User Details */}
          <div className="space-y-4 text-left">
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
              <span className="font-bold text-[#8B4513]">Phone:</span>
              <span className="ml-2 text-gray-700">
                {user?.phone}
              </span>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
              <span className="font-bold text-[#8B4513]">Address:</span>
              <span className="ml-2 text-gray-700">
                {user?.address}
              </span>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full mt-8 bg-red-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 transition duration-300 shadow-md"
          >
            Logout
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;