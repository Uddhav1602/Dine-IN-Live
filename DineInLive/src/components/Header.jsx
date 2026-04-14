import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dashOpen, setDashOpen] = useState(false);
  const dashRef = useRef(null);

  // Re-read token and role on every render (location changes trigger re-render)
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");

  const closeMenu = () => setMenuOpen(false);
  const closeDash = () => setDashOpen(false);

  // Close dashboard dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dashRef.current && !dashRef.current.contains(e.target)) {
        setDashOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Dashboard menu items — My Mess only for mess owners / admins
  const dashItems = [
    { to: "/search",     emoji: "🔍", label: "Find Mess",  always: true  },
    { to: "/mess-owner", emoji: "🏠", label: "My Mess",    ownerOnly: true },
    { to: "/orders",     emoji: "📋", label: "Orders",     always: true  },
    { to: "/favorites",  emoji: "❤️", label: "Favorites",  always: true  },
  ].filter(item => {
    if (item.ownerOnly) return role === "mess_owner" || role === "admin";
    return true;
  });

  return (
    <nav className="flex justify-between items-center px-5 py-4 text-white bg-gradient-to-l from-[#8B5A2B] to-[#5C2E00] shadow-md relative z-50">

      {/* Logo */}
      <h2 className="text-2xl font-bold m-0">
        <Link to="/" className="text-white no-underline hover:opacity-90" onClick={closeMenu}>
          🍽 Dine In Live
        </Link>
      </h2>

      {/* ===== DESKTOP NAV ===== */}
      <div className="hidden md:flex gap-5 font-bold text-base items-center">
        <Link to="/" className="text-white hover:text-yellow-200 transition no-underline">Home</Link>
        <Link to="/partner" className="text-white hover:text-yellow-200 transition no-underline">Partner with Us</Link>

        {token && role === "admin" && (
          <Link to="/admin" className="text-orange-300 hover:text-orange-200 font-bold transition no-underline">Admin</Link>
        )}

        {token && (
          <>
            {/* Profile avatar link */}
            <Link
              to="/profile"
              className="flex items-center gap-2 text-white hover:text-yellow-200 transition no-underline"
            >
              <div className="w-8 h-8 bg-white/20 border border-white/40 rounded-full flex items-center justify-center text-sm font-bold">
                {username ? username.charAt(0).toUpperCase() : "U"}
              </div>
            </Link>

            {/* ⋮ Dashboard Dropdown */}
            <div className="relative" ref={dashRef}>
              <button
                onClick={() => setDashOpen(!dashOpen)}
                className="flex items-center justify-center w-9 h-9 rounded-full bg-white/15 border border-white/30 hover:bg-white/25 transition"
                aria-label="Dashboard menu"
              >
                <span className="flex flex-col gap-[4px] items-center justify-center">
                  <span className="block w-1 h-1 rounded-full bg-white"></span>
                  <span className="block w-1 h-1 rounded-full bg-white"></span>
                  <span className="block w-1 h-1 rounded-full bg-white"></span>
                </span>
              </button>

              {/* Dropdown panel */}
              {dashOpen && (
                <div className="absolute right-0 top-full mt-3 w-52 bg-white rounded-2xl shadow-2xl overflow-hidden z-[999] border border-gray-100">
                  {/* Arrow pointer */}
                  <div className="absolute -top-2 right-3 w-4 h-4 bg-white rotate-45 border-l border-t border-gray-100"></div>

                  <div className="p-2">
                    <p className="text-xs text-gray-400 font-semibold px-3 pt-2 pb-1 uppercase tracking-widest">My Dashboard</p>
                    {dashItems.map(item => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={closeDash}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#3B1E00] font-semibold hover:bg-orange-50 hover:text-[#D2691E] transition no-underline text-sm"
                      >
                        <span className="text-base">{item.emoji}</span>
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {!token && (
          <Link
            to="/login"
            className="bg-white text-[#5C2E00] font-bold px-5 py-1.5 rounded-full hover:bg-yellow-100 transition no-underline text-sm"
          >
            Sign In
          </Link>
        )}
      </div>

      {/* ===== MOBILE HAMBURGER BUTTON ===== */}
      <button
        className="md:hidden flex flex-col gap-[5px] p-2 rounded focus:outline-none"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`}></span>
        <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}></span>
        <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`}></span>
      </button>

      {/* ===== MOBILE DROPDOWN MENU ===== */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-[#5C2E00] flex flex-col gap-0 shadow-xl z-50 md:hidden">
          <Link to="/" className="px-6 py-4 text-white font-bold border-b border-white/10 hover:bg-white/10 transition" onClick={closeMenu}>🏡 Home</Link>
          <Link to="/partner" className="px-6 py-4 text-white font-bold border-b border-white/10 hover:bg-white/10 transition" onClick={closeMenu}>🤝 Partner with Us</Link>

          {token && (
            <>
              {/* Dashboard section header */}
              <p className="px-6 pt-4 pb-1 text-xs text-white/50 font-semibold uppercase tracking-widest">My Dashboard</p>
              {dashItems.map(item => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="px-6 py-3 text-white font-bold border-b border-white/10 hover:bg-white/10 transition"
                  onClick={closeMenu}
                >
                  {item.emoji} {item.label}
                </Link>
              ))}

              {role === "admin" && (
                <Link to="/admin" className="px-6 py-3 text-orange-300 font-bold border-b border-white/10 hover:bg-white/10 transition" onClick={closeMenu}>⚙️ Admin</Link>
              )}

              <Link to="/profile" className="px-6 py-3 text-yellow-300 font-bold hover:bg-white/10 transition" onClick={closeMenu}>
                👤 Profile ({username})
              </Link>
            </>
          )}

          {!token && (
            <Link to="/login" className="px-6 py-4 text-yellow-300 font-bold hover:bg-white/10 transition" onClick={closeMenu}>Sign In</Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Header;
