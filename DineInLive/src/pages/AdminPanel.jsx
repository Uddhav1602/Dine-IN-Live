import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [messes, setMesses] = useState([]);
  const [activeTab, setActiveTab] = useState("users");
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/admin/users`,
          {
            withCredentials: true
          }
        );

        setUsers(res.data);
      } catch (err) {
        console.error("Admin fetch users error:", err);

        setErrorMsg(
          err.response?.data?.error ||
          "Failed to connect to the backend server."
        );
      }
    };

    fetchUsers();
  }, []);

  // Fetch messes
  useEffect(() => {
    const fetchMesses = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/admin/messes`,
          {
            withCredentials: true
          }
        );

        setMesses(res.data);
      } catch (err) {
        console.error("Admin fetch messes error:", err);
      }
    };

    fetchMesses();
  }, []);

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/admin/users/${id}`,
        {
          withCredentials: true
        }
      );

      setUsers((prevUsers) =>
        prevUsers.filter((u) => u._id !== id)
      );
    } catch (err) {
      alert(
        "Failed to delete user: " +
        (err.response?.data?.error || err.message)
      );
    }
  };

  const deleteMess = async (id) => {
    if (!window.confirm("Delete this mess?")) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/admin/messes/${id}`,
        {
          withCredentials: true
        }
      );

      setMesses((prevMesses) =>
        prevMesses.filter((m) => m._id !== id)
      );
    } catch (err) {
      alert(
        "Failed to delete mess: " +
        (err.response?.data?.error || err.message)
      );
    }
  };

  const makeAdmin = async (id, username) => {
    if (!window.confirm(`Make ${username} an admin?`)) return;

    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/admin/users/${id}/role`,
        { role: "admin" },
        {
          withCredentials: true
        }
      );

      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u._id === id
            ? { ...u, role: "admin" }
            : u
        )
      );

    } catch (err) {
      alert(
        "Error: " +
        (err.response?.data?.error || err.message)
      );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />

      <div className="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-[#5C2E00] mb-6 text-center">
          Admin Dashboard
        </h2>

        {errorMsg && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center">
            {errorMsg}
          </div>
        )}

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveTab("users")}
            className={`px-6 py-2 rounded font-bold transition-colors ${
              activeTab === "users"
                ? "bg-[#D2691E] text-white"
                : "bg-white border text-gray-600 hover:bg-gray-50"
            }`}
          >
            Users
          </button>

          <button
            onClick={() => setActiveTab("messes")}
            className={`px-6 py-2 rounded font-bold transition-colors ${
              activeTab === "messes"
                ? "bg-[#D2691E] text-white"
                : "bg-white border text-gray-600 hover:bg-gray-50"
            }`}
          >
            Messes
          </button>
        </div>

        {/* USERS TABLE */}
        {activeTab === "users" && (
          <div className="overflow-x-auto bg-white shadow rounded-lg border border-gray-200">
            <table className="w-full text-left min-w-[600px]">
              <thead className="bg-[#5C2E00] text-white">
                <tr>
                  <th className="p-4 font-semibold">Username</th>
                  <th className="p-4 font-semibold">Email</th>
                  <th className="p-4 font-semibold">Phone</th>
                  <th className="p-4 font-semibold">Role</th>
                  <th className="p-4 font-semibold text-right">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b hover:bg-orange-50 transition"
                  >
                    <td className="p-4 font-medium text-[#3B1E00]">
                      {user.username}
                    </td>

                    <td className="p-4 text-gray-600">
                      {user.email}
                    </td>

                    <td className="p-4 text-gray-600">
                      {user.phone}
                    </td>

                    <td className="p-4 capitalize">
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold ${
                          user.role === "admin"
                            ? "bg-orange-100 text-orange-700"
                            : user.role === "mess_owner"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        {user.role !== "admin" && (
                          <button
                            onClick={() =>
                              makeAdmin(user._id, user.username)
                            }
                            className="bg-green-100 text-green-700 font-bold px-3 py-1.5 rounded hover:bg-green-600 hover:text-white transition text-sm"
                          >
                            Make Admin
                          </button>
                        )}

                        <button
                          onClick={() =>
                            deleteUser(user._id)
                          }
                          className="bg-red-100 text-red-600 font-bold px-3 py-1.5 rounded hover:bg-red-600 hover:text-white transition text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {users.length === 0 && !errorMsg && (
                  <tr>
                    <td
                      colSpan="5"
                      className="p-8 text-center text-gray-500"
                    >
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* MESSES TABLE */}
        {activeTab === "messes" && (
          <div className="overflow-x-auto bg-white shadow rounded-lg border border-gray-200">
            <table className="w-full text-left min-w-[600px]">
              <thead className="bg-[#5C2E00] text-white">
                <tr>
                  <th className="p-4 font-semibold">Name</th>
                  <th className="p-4 font-semibold">Location</th>
                  <th className="p-4 font-semibold">Rating</th>
                  <th className="p-4 font-semibold text-right">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {messes.map((mess) => (
                  <tr
                    key={mess._id}
                    className="border-b hover:bg-orange-50 transition"
                  >
                    <td className="p-4 font-medium text-[#3B1E00]">
                      {mess.name}
                    </td>

                    <td className="p-4 text-gray-600">
                      {mess.location}
                    </td>

                    <td className="p-4 font-bold text-[#D2691E]">
                      {mess.rating} ⭐
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() =>
                          deleteMess(mess._id)
                        }
                        className="bg-red-100 text-red-600 font-bold px-4 py-1.5 rounded hover:bg-red-600 hover:text-white transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {messes.length === 0 && !errorMsg && (
                  <tr>
                    <td
                      colSpan="4"
                      className="p-8 text-center text-gray-500"
                    >
                      No messes found.
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