import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [messes, setMesses] = useState([]);
  const [activeTab, setActiveTab] = useState("users");

  // Fetch users
  useEffect(() => {
    fetch("http://localhost:5000/api/admin/users")
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  // Fetch messes
  useEffect(() => {
    fetch("http://localhost:5000/api/messes")
      .then(res => res.json())
      .then(data => setMesses(data));
  }, []);

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    await fetch(`http://localhost:5000/api/admin/users/${id}`, {
      method: "DELETE"
    });
    setUsers(users.filter(u => u._id !== id));
  };

  const deleteMess = async (id) => {
    if (!window.confirm("Delete this mess?")) return;
    await fetch(`http://localhost:5000/api/messes/${id}`, {
      method: "DELETE"
    });
    setMesses(messes.filter(m => m._id !== id));
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />

      <div className="flex-1 p-8 max-w-6xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-[#5C2E00] mb-6 text-center">
          Admin Dashboard
        </h2>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveTab("users")}
            className={`px-6 py-2 rounded font-bold ${
              activeTab === "users"
                ? "bg-[#D2691E] text-white"
                : "bg-white border"
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab("messes")}
            className={`px-6 py-2 rounded font-bold ${
              activeTab === "messes"
                ? "bg-[#D2691E] text-white"
                : "bg-white border"
            }`}
          >
            Messes
          </button>
        </div>

        {/* USERS TABLE */}
        {activeTab === "users" && (
          <div className="overflow-x-auto bg-white shadow rounded">
            <table className="w-full">
              <thead className="bg-[#5C2E00] text-white">
                <tr>
                  <th className="p-3">Username</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id} className="border-b">
                    <td className="p-3">{user.username}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">{user.phone}</td>
                    <td className="p-3">
                      <button
                        onClick={() => deleteUser(user._id)}
                        className="bg-red-600 text-white px-4 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="4" className="p-4 text-center">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* MESSES TABLE */}
        {activeTab === "messes" && (
          <div className="overflow-x-auto bg-white shadow rounded">
            <table className="w-full">
              <thead className="bg-[#5C2E00] text-white">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Rating</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {messes.map(mess => (
                  <tr key={mess._id} className="border-b">
                    <td className="p-3">{mess.name}</td>
                    <td className="p-3">{mess.location}</td>
                    <td className="p-3">{mess.rating}</td>
                    <td className="p-3">
                      <button
                        onClick={() => deleteMess(mess._id)}
                        className="bg-red-600 text-white px-4 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {messes.length === 0 && (
                  <tr>
                    <td colSpan="4" className="p-4 text-center">
                      No messes found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default AdminPanel;
