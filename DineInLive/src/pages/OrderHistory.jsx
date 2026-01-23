import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');

      // If no token, redirect to login
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/user/orders', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Send the token to the backend
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <div className="flex-1 container mx-auto p-6 max-w-4xl">
        <h2 className="text-3xl font-bold text-[#5C2E00] mb-8 text-center border-b-2 border-[#D2691E] pb-4 inline-block w-full">
          Your Order History
        </h2>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-10">
            <p className="text-xl text-gray-600 animate-pulse">Loading your delicious history...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && orders.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-600 text-lg mb-4">You haven't placed any orders yet.</p>
            <Link 
              to="/search" 
              className="bg-[#D2691E] text-white px-6 py-2 rounded-md hover:bg-[#8B4513] transition"
            >
              Find a Mess Now
            </Link>
          </div>
        )}

        {/* Orders List */}
        <div className="space-y-6">
          {orders.map((order) => (
            <div 
              key={order._id} 
              className="bg-white rounded-lg shadow-md border-l-4 border-[#D2691E] overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-[#8B4513]">{order.messName || "Mess Name Unavailable"}</h3>
                    <p className="text-sm text-gray-500">
                      Placed on: {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {order.status}
                  </span>
                </div>

                {/* Order Items */}
                <div className="bg-orange-50 p-4 rounded-md mb-4">
                  <ul className="space-y-2">
                    {order.items.map((item, index) => (
                      <li key={index} className="flex justify-between text-gray-700">
                        <span>
                          <span className="font-bold text-[#D2691E]">{item.quantity}x</span> {item.name}
                        </span>
                        <span>₹{item.price * item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex justify-between items-center border-t pt-4">
                  <p className="text-sm text-gray-500">Order ID: #{order._id.slice(-6).toUpperCase()}</p>
                  <p className="text-xl font-bold text-[#5C2E00]">
                    Total: ₹{order.totalAmount}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrderHistory;