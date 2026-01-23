import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const MessOwnerDashboard = () => {
  const [activeSection, setActiveSection] = useState('add-item');
  const [menuItems, setMenuItems] = useState([]);
  
  // 🔹 NEW: State to store the Mess ID
  const [messId, setMessId] = useState(null);
  
  // Form States
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  
  // Thali Logic
  const [isThali, setIsThali] = useState(false);
  const [thaliCount, setThaliCount] = useState(0);
  const [thaliContents, setThaliContents] = useState([]);

  // 🔹 NEW: Fetch Mess ID and Menu on Load
  useEffect(() => {
    const fetchMyMess = async () => {
      const token = localStorage.getItem("token"); // Get login token
      if (!token) {
        alert("Please login first!");
        return;
      }

      try {
        // 1. Ask backend: "Which mess belongs to me?"
        const res = await fetch("http://localhost:5000/api/my-mess", {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!res.ok) throw new Error("Could not find your mess");
        
        const data = await res.json();
        setMessId(data._id); // ✅ Save the ID
        setMenuItems(data.menuItems || []); // ✅ Load existing menu items
      } catch (err) {
        console.error("Error fetching mess:", err);
      }
    };

    fetchMyMess();
  }, []);

  const handleNameChange = (e) => {
    const val = e.target.value;
    setItemName(val);
    setIsThali(val.toLowerCase().includes('thali'));
  };

  useEffect(() => {
    setThaliContents(Array(Number(thaliCount)).fill(''));
  }, [thaliCount]);

  const handleThaliContentChange = (index, value) => {
    const newContents = [...thaliContents];
    newContents[index] = value;
    setThaliContents(newContents);
  };

  // 🔹 UPDATED: Connect to Backend
  const handleAddItem = async () => {
    if (!itemName || !itemPrice) return;
    if (!messId) return alert("Error: No Mess ID found. Please refresh.");

    const newItemData = {
      name: itemName,
      price: Number(itemPrice),
      contents: isThali ? thaliContents.join(', ') : '-'
    };

    try {
        const token = localStorage.getItem("token");

        // 1. Send data to server
        const response = await fetch(`http://localhost:5000/api/messes/${messId}/menu`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(newItemData)
        });

        const savedItem = await response.json();

        if (!response.ok) {
            throw new Error(savedItem.error || "Failed to add item");
        }

        // 2. Update UI with the item saved in DB
        setMenuItems([...menuItems, savedItem]);
        
        // 3. Clear Form
        setItemName('');
        setItemPrice('');
        setThaliCount(0);
        setIsThali(false);
        alert("Item Added Successfully!");

    } catch (error) {
        console.error("Add Item Error:", error);
        alert("Failed to save item: " + error.message);
    }
  };

  // 🔹 UPDATED: Delete from Backend
  const handleDelete = async (itemId) => {
    if (!messId) return;

    try {
        const token = localStorage.getItem("token");
        await fetch(`http://localhost:5000/api/messes/${messId}/menu/${itemId}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });

        // Remove from UI
        setMenuItems(menuItems.filter(item => item._id !== itemId));
    } catch (error) {
        console.error("Delete Error:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#8B5A2B] font-sans text-center text-[#3B1E00]">
      {/* Header specific for Dashboard */}
      <div className="flex justify-between items-center p-4 bg-gradient-to-l from-[#8B5A2B] to-[#5C2E00] text-white">
        <h2 className="text-2xl font-bold">Mess Owner Dashboard</h2>
        <div className="flex gap-4 font-bold">
          <Link to="/" className="text-white hover:underline">Home</Link>
          <Link to="/profile" className="text-white hover:underline">Profile</Link>
        </div>
      </div>

      <div className="flex-1 p-8 bg-white m-8 rounded-lg shadow-2xl max-w-4xl mx-auto w-full">
        <h2 className="text-3xl text-[#5C2E00] font-bold mb-4">Manage Your Mess</h2>
        <p className="mb-8 text-lg">Choose an option below:</p>

        {/* Action Cards */}
        <div className="flex flex-wrap justify-center gap-8 mb-10">
          {['add-item', 'edit-item', 'delete-item'].map((action) => (
            <div 
              key={action}
              onClick={() => setActiveSection(action)}
              className="bg-white p-8 w-60 rounded-2xl shadow-md cursor-pointer text-xl font-bold transition transform hover:scale-110 hover:bg-[#D2691E] hover:text-white capitalize border border-gray-100"
            >
              {action.replace('-', ' ')}
            </div>
          ))}
        </div>

        {/* Add Item Form Area */}
        {activeSection === 'add-item' && (
          <div className="bg-gray-50 p-10 rounded-xl shadow-inner mb-8 border border-gray-200 w-full max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-[#5C2E00]">Add Menu Item</h2>
            
            <input 
              type="text" 
              placeholder="Item Name" 
              value={itemName} 
              onChange={handleNameChange} 
              className="w-full p-3 mb-4 text-base border border-[#5C2E00] rounded focus:outline-none focus:ring-2 focus:ring-[#D2691E]"
            />
            
            <input 
              type="number" 
              placeholder="Price" 
              value={itemPrice} 
              onChange={(e) => setItemPrice(e.target.value)} 
              className="w-full p-3 mb-4 text-base border border-[#5C2E00] rounded focus:outline-none focus:ring-2 focus:ring-[#D2691E]"
            />

            {isThali && (
              <div className="bg-white p-4 rounded border border-gray-300 mb-4 animate-fade-in-down">
                <h3 className="font-bold mb-2">Thali Contents</h3>
                <input 
                  type="number" 
                  placeholder="Number of items" 
                  min="1" 
                  onChange={(e) => setThaliCount(e.target.value)} 
                  className="w-full p-2 mb-2 border border-gray-300 rounded"
                />
                <div className="flex flex-col gap-2">
                  {thaliContents.map((val, idx) => (
                    <input
                      key={idx}
                      type="text"
                      placeholder={`Item ${idx + 1}`}
                      value={val}
                      onChange={(e) => handleThaliContentChange(idx, e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  ))}
                </div>
              </div>
            )}

            <button 
              onClick={handleAddItem}
              className="w-full p-3 bg-[#D2691E] text-white font-bold rounded hover:bg-[#8B4513] transition-colors"
            >
              Add Item
            </button>
          </div>
        )}

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full mt-4 border-collapse bg-white shadow-sm">
            <thead>
              <tr className="bg-[#5C2E00] text-white">
                <th className="p-3 border border-[#5C2E00]">Item Name</th>
                <th className="p-3 border border-[#5C2E00]">Price</th>
                <th className="p-3 border border-[#5C2E00]">Contents</th>
                <th className="p-3 border border-[#5C2E00]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {menuItems.map((item) => (
                <tr key={item._id} className="hover:bg-orange-50">
                  <td className="p-3 border border-[#5C2E00]">{item.name}</td>
                  <td className="p-3 border border-[#5C2E00]">{item.price}</td>
                  <td className="p-3 border border-[#5C2E00]">{item.contents}</td>
                  <td className="p-3 border border-[#5C2E00]">
                    <button className="mr-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">Edit</button>
                    <button onClick={() => handleDelete(item._id)} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MessOwnerDashboard;