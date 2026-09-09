import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from '../components/Footer';

const MessOwnerDashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('menu');
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Profile State
  const [messProfile, setMessProfile] = useState({
    _id: "",
    name: "",
    location: "",
    fullAddress: "",
    bannerImage:
      "https://images.unsplash.com/photo-1543353071-87d98dec2144?q=80&w=2070&auto=format&fit=crop",
  });

  // Form States
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [isThali, setIsThali] = useState(false);
  const [thaliCount, setThaliCount] = useState(0);
  const [thaliContents, setThaliContents] = useState([]);

  // --- 1. FETCH MESS DATA FROM DATABASE ON LOAD ---
  useEffect(() => {
    const fetchMessData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/messes/my`,
          {
            withCredentials: true,
          }
        );

        const data = response.data;

        setMessProfile(data);

        if (data.menuItems) {
          setMenuItems(data.menuItems);
        }

      } catch (error) {
        console.error(
          "Error fetching mess:",
          error.response?.data?.error || error.message
        );

        // Fallback for existing demo/local data
        const localData = JSON.parse(
          localStorage.getItem('newMess')
        );

        if (localData) {
          setMessProfile(prev => ({
            ...prev,
            ...localData
          }));
        }

      } finally {
        setLoading(false);
      }
    };

    fetchMessData();
  }, []);

  // --- Handlers ---

  const handleNameChange = (e) => {
    const val = e.target.value;

    setItemName(val);

    setIsThali(
      val.toLowerCase().includes('thali')
    );
  };

  useEffect(() => {
    setThaliContents(
      Array(Number(thaliCount)).fill('')
    );
  }, [thaliCount]);

  const handleThaliContentChange = (index, value) => {
    const newContents = [...thaliContents];

    newContents[index] = value;

    setThaliContents(newContents);
  };

  // --- 2. ADD ITEM TO DATABASE ---

  const handleAddItem = async () => {
    if (!itemName || !itemPrice) return;

    const newItem = {
      name: itemName,
      price: Number(itemPrice),
      contents: isThali
        ? thaliContents.join(', ')
        : 'Single Item'
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/messes/${messProfile._id}/menu`,
        newItem,
        {
          withCredentials: true,
        }
      );

      const savedItem = response.data;

      // Update UI with item returned from DB
      setMenuItems([
        ...menuItems,
        savedItem
      ]);

      // Reset Form
      setItemName('');
      setItemPrice('');
      setThaliCount(0);
      setIsThali(false);

      alert("Item added successfully!");

    } catch (error) {
      console.error(
        "Error adding item:",
        error.response?.data?.error || error.message
      );

      alert(
        error.response?.data?.error ||
        "Failed to save item to database."
      );
    }
  };

  // --- 3. DELETE ITEM FROM DATABASE ---

  const handleDelete = async (itemId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/messes/${messProfile._id}/menu/${itemId}`,
        {
          withCredentials: true,
        }
      );

      // Remove from UI
      setMenuItems(
        menuItems.filter(
          item =>
            item._id !== itemId &&
            item.id !== itemId
        )
      );

    } catch (error) {
      console.error(
        "Error deleting item:",
        error.response?.data?.error || error.message
      );

      alert("Could not delete item.");
    }
  };

  // --- 4. LOGOUT USING JWT COOKIE ---

  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      );

      // These are only UI-related localStorage values.
      // JWT authentication is handled through the cookie.
      // localStorage.removeItem('userId');
      // localStorage.removeItem('username');
      // localStorage.removeItem('role');

      navigate('/login');

    } catch (error) {
      console.error(
        "Logout failed:",
        error.response?.data?.error || error.message
      );
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans text-[#3B1E00]">

      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-[#5C2E00] text-white shadow-md">
        <h2 className="text-xl font-bold">Mess Owner Panel</h2>

        <div className="flex gap-6 text-sm font-medium">
          <Link
            to="/"
            className="hover:text-[#D2691E] transition"
          >
            Home
          </Link>

          <button
            onClick={handleLogout}
            className="hover:text-red-400 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Hero / Profile Section */}
      <div className="relative w-full h-80 bg-gray-300 group">
        <img
          src={
            messProfile.bannerImage ||
            "https://images.unsplash.com/photo-1543353071-87d98dec2144?q=80&w=2070&auto=format&fit=crop"
          }
          alt="Mess Banner"
          className="w-full h-full object-cover"
        />

        <div className="absolute top-[80%] md:bottom-[-40px] left-0 right-0 mx-auto w-[95%] md:w-[800px] bg-white p-6 rounded-xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#5C2E00]">
              {messProfile.name || "My Mess"}
            </h1>

            <p className="text-gray-600 font-medium flex items-center gap-2 mt-1 text-sm md:text-base">
              📍 {messProfile.location}
            </p>

            {messProfile.googleMapsLink && (
              <a
                href={messProfile.googleMapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 text-sm hover:underline mt-1 block max-w-xs break-all truncate"
              >
                View Location ↗
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main Dashboard Area */}
      <div className="mt-40 md:mt-20 flex-1 max-w-6xl mx-auto w-full p-6">

        {/* Tabs */}
        <div className="flex border-b border-gray-300 mb-6 w-full overflow-x-auto whitespace-nowrap">
          <button
            onClick={() => setActiveSection('menu')}
            className={`py-3 px-6 font-bold text-lg ${
              activeSection === 'menu'
                ? 'border-b-4 border-[#D2691E] text-[#D2691E]'
                : 'text-gray-500 hover:text-[#5C2E00]'
            }`}
          >
            Menu Management
          </button>
        </div>

        {/* CONTENT: Menu Management */}
        {activeSection === 'menu' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left Column: Add Item Form */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 h-fit">
              <h3 className="text-xl font-bold mb-4 text-[#5C2E00] border-b pb-2">
                Add New Item
              </h3>

              <div className="space-y-4">

                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-1">
                    Item Name
                  </label>

                  <input
                    type="text"
                    placeholder="e.g. Veg Thali"
                    value={itemName}
                    onChange={handleNameChange}
                    className="w-full p-2 border border-gray-300 rounded focus:border-[#D2691E] outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-1">
                    Price (₹)
                  </label>

                  <input
                    type="number"
                    placeholder="0.00"
                    value={itemPrice}
                    onChange={(e) => setItemPrice(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:border-[#D2691E] outline-none transition"
                  />
                </div>

                {isThali && (
                  <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">

                    <label className="block text-sm font-bold text-[#D2691E] mb-1">
                      Thali Contents
                    </label>

                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs">
                        Count:
                      </span>

                      <input
                        type="number"
                        min="1"
                        onChange={(e) =>
                          setThaliCount(e.target.value)
                        }
                        className="w-16 p-1 border border-gray-300 rounded text-center"
                      />
                    </div>

                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {thaliContents.map((val, idx) => (
                        <input
                          key={idx}
                          type="text"
                          placeholder={`Item ${idx + 1}`}
                          value={val}
                          onChange={(e) =>
                            handleThaliContentChange(
                              idx,
                              e.target.value
                            )
                          }
                          className="w-full p-1.5 text-sm border border-gray-300 rounded"
                        />
                      ))}
                    </div>

                  </div>
                )}

                <button
                  onClick={handleAddItem}
                  className="w-full py-3 bg-[#D2691E] text-white font-bold rounded-lg hover:bg-[#8B4513] transition shadow-md"
                >
                  + Add to Menu
                </button>

              </div>
            </div>

            {/* Right Column: Menu List */}
            <div className="lg:col-span-2 overflow-x-auto">
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 min-w-[500px]">

                <table className="w-full text-left border-collapse">

                  <thead className="bg-[#5C2E00] text-white">
                    <tr>
                      <th className="p-4 font-semibold">
                        Name
                      </th>

                      <th className="p-4 font-semibold">
                        Contents
                      </th>

                      <th className="p-4 font-semibold">
                        Price
                      </th>

                      <th className="p-4 font-semibold text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {menuItems.length === 0 ? (
                      <tr>
                        <td
                          colSpan="4"
                          className="p-8 text-center text-gray-500 italic"
                        >
                          No items added yet.
                        </td>
                      </tr>
                    ) : (
                      menuItems.map((item, index) => (
                        <tr
                          key={item._id || index}
                          className="border-b hover:bg-orange-50 transition"
                        >
                          <td className="p-4 font-bold text-[#3B1E00]">
                            {item.name}
                          </td>

                          <td className="p-4 text-sm text-gray-600">
                            {item.contents}
                          </td>

                          <td className="p-4 font-bold text-[#D2691E]">
                            ₹{item.price}
                          </td>

                          <td className="p-4 text-right">
                            <button
                              onClick={() =>
                                handleDelete(
                                  item._id || item.id
                                )
                              }
                              className="px-3 py-1 bg-red-100 text-red-600 rounded-md hover:bg-red-600 hover:text-white transition text-sm"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>

                </table>
              </div>
            </div>

          </div>
        )}

      </div>

      <Footer />
    </div>
  );
};

export default MessOwnerDashboard;