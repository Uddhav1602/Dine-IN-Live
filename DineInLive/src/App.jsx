import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import MessOwnerDashboard from "./pages/MessOwnerDashboard";
import SearchMess from "./pages/SearchMess";
import OrderHistory from "./pages/OrderHistory";
import AdminPanel from "./pages/AdminPanel";
import PartnerWithUs from "./pages/PartnerWithUs";
import PartnerInfo from "./pages/PartnerInfo";
import MessDetails from "./pages/MessDetails";
import Favorites from "./pages/Favorites"; // <--- IMPORT THIS
import Profile from "./pages/Profile";

/* ... ProtectedRoute component remains same ... */
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
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
        <Route path="/mess/:id" element={<MessDetails />}/>
        <Route path="/profile" element={<Profile />} />
        {/* New Route for Favorites */}
        <Route 
            path="/favorites" 
            element={
                <ProtectedRoute>
                    <Favorites />
                </ProtectedRoute>
            } 
        />

        {/* Existing Protected Routes */}
        <Route path="/orders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
        <Route path="/mess-owner" element={<ProtectedRoute><MessOwnerDashboard /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
        
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;