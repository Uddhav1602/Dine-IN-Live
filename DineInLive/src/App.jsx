import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import MessOwnerDashboard from "./pages/MessOwnerDashBoard";
import SearchMess from "./pages/SearchMess";
import OrderHistory from "./pages/OrderHistory";
import AdminPanel from "./pages/AdminPanel";
import PartnerWithUs from "./pages/PartnerWithUs";
import PartnerInfo from "./pages/PartnerInfo";
import MessDetails from "./pages/MessDetails";
import Favorites from "./pages/Favorites";
import Profile from "./pages/Profile";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get(
          `${import.meta.env.VITE_API_URL}/api/auth/check-auth`,
          {
            withCredentials: true,
            headers: {
              "Cache-Control": "no-cache"
            }
          }
        );

        setAuthenticated(true);

      } catch (err) {
        setAuthenticated(false);

      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return authenticated
    ? children
    : <Navigate to="/login" replace />;
};


const AdminRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/auth/check-auth`,
          {
            withCredentials: true,
            headers: {
              "Cache-Control": "no-cache"
            }
          }
        );

        setAuthenticated(true);
        setRole(res.data.role);

      } catch (err) {
        setAuthenticated(false);

      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};


const MessOwnerRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/auth/check-auth`,
          {
            withCredentials: true,
            headers: {
              "Cache-Control": "no-cache"
            }
          }
        );

        setAuthenticated(true);
        setRole(res.data.role);

      } catch (err) {
        setAuthenticated(false);

      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role !== "mess_owner" && role !== "admin") {
    return <Navigate to="/partner" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/search" element={<SearchMess />} />
        <Route path="/partner" element={<PartnerWithUs />} />
        <Route path="/partner-info" element={<PartnerInfo />} />
        <Route path="/mess/:id" element={<MessDetails />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Protected: Favorites */}
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes */}
        <Route path="/orders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
        <Route path="/mess-owner" element={<MessOwnerRoute><MessOwnerDashboard /></MessOwnerRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />

        <Route path="*" element={
          <div className="flex items-center justify-center min-h-screen text-center">
            <div>
              <h1 className="text-6xl font-bold text-[#5C2E00]">404</h1>
              <p className="text-xl text-gray-600 mt-4">Page not found</p>
              <a href="/" className="mt-6 inline-block bg-[#D2691E] text-white px-6 py-2 rounded-lg hover:bg-[#8B4513] transition">Go Home</a>
            </div>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;