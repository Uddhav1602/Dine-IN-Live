import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const PartnerInfo = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    googleMapsLink: "",
    fullAddress: "",
    ownerPhone: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !formData.name ||
      !formData.location ||
      !formData.googleMapsLink ||
      !formData.fullAddress ||
      !formData.ownerPhone ||
      !formData.email
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (!formData.googleMapsLink.includes("google.com/maps")) {
      setError("Please enter a valid Google Maps link.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/messes`,
        formData,
        {
          withCredentials: true,
        }
      );

      console.log("Mess registration successful:", response.data);

      navigate("/mess-owner");
    } catch (err) {
      console.error("Mess registration error:", err);

      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to register mess. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
            Partner With Us
          </h1>

          <p className="text-center text-gray-600 mb-8">
            Register your mess and start managing it through DineInLive.
          </p>

          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-100 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Mess Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Mess Name
              </label>

              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter mess name"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Location */}
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Location
              </label>

              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter location"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Google Maps Link */}
            <div>
              <label
                htmlFor="googleMapsLink"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Google Maps Link
              </label>

              <input
                type="url"
                id="googleMapsLink"
                name="googleMapsLink"
                value={formData.googleMapsLink}
                onChange={handleChange}
                placeholder="Paste Google Maps link"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <p className="mt-1 text-xs text-gray-500">
                Open Google Maps, find your mess, click Share → Copy link, and
                paste it here.
              </p>
            </div>

            {/* Full Address */}
            <div>
              <label
                htmlFor="fullAddress"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Address
              </label>

              <textarea
                id="fullAddress"
                name="fullAddress"
                value={formData.fullAddress}
                onChange={handleChange}
                placeholder="Enter full address"
                rows="3"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Owner Phone */}
            <div>
              <label
                htmlFor="ownerPhone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Owner Phone
              </label>

              <input
                type="tel"
                id="ownerPhone"
                name="ownerPhone"
                value={formData.ownerPhone}
                onChange={handleChange}
                placeholder="Enter owner phone number"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>

              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Registering..." : "Register Mess"}
            </button>

          </form>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default PartnerInfo;