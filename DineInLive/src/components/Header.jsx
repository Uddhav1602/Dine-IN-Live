import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <div className="flex justify-between items-center p-7 text-white bg-gradient-to-l from-[#8B5A2B] to-[#5C2E00]">
      
      {/* Logo */}
      <h2 className="text-2xl font-bold m-0">
        <Link to="/" className="text-white no-underline hover:opacity-90">
          Dine In Live
        </Link>
      </h2>
      
      {/* Navigation */}
      <div className="flex gap-6 font-bold text-lg items-center">

        <Link to="/" className="flex items-center text-white hover:text-gray-200 no-underline">
          Home
        </Link>

        <Link to="/partner" className="flex items-center text-white hover:text-gray-200 no-underline">
          Partner with us
        </Link>

        {/* 🔐 Logged-in */}
        {token && (
          <>
            <Link
              to="/admin"
              className="flex items-center text-white hover:text-orange-200 font-bold px-4"
            >
              Admin
            </Link>

            <Link to="/profile" className="flex items-center text-white hover:text-orange-200 font-bold px-4">
              Profile
            </Link>
          </>
        )}

        {/* 🔓 Logged-out */}
        {!token && (
          <Link
            to="/login"
            className="text-white hover:text-gray-200 no-underline"
          >
            Sign in
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;
