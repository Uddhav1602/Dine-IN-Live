import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

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
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

// Only accessible to logged-in users with role="admin"
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  if (!token) return <Navigate to="/login" replace />;
  if (role !== "admin") return <Navigate to="/" replace />;
  return children;
};

// Only accessible to mess owners and admins
const MessOwnerRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  if (!token) return <Navigate to="/login" replace />;
  if (role !== "mess_owner" && role !== "admin") return <Navigate to="/partner" replace />;
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
        <Route path="/profile" element={<Profile />} />

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