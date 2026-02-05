import React, { useEffect, useState } from "react";
import axios from "axios";
import { Baseline } from "lucide-react";
import { capitalize } from "@mui/material";

const facultyManagement = () => {
  const [faculty, setFaculty] = useState([]);
  const [search, setSearch] = useState("");
  const BaseUrl = import.meta.env.VITE_BASEURL;
  const [message, setMessage] = useState(null);

  // Fetch all faculty
  useEffect(() => {
    fetchFaculty();
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const fetchFaculty = async () => {
    try {
      const res = await axios.get(`${BaseUrl}/api/faculty/all`);
      console.log(res.data)
      setFaculty(res.data);
    } catch (err) {
      setMessage("❌ Error fetching faculty");
    }
  };

  const deleteFaculty = async (id) => {
    if (window.confirm("Are you sure you want to delete this faculty?")) {
      try {
        const resp = await axios.delete(`${BaseUrl}/api/faculty/${id}`);
        setMessage(resp.data.message);
      } catch (err) {
        setMessage("❌ Error deleting faculty");
      }
    } else {
      return;
    }
  };

  return (
    <section className="p-6 mt-10 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Manage Faculty</h2>

        {/* Search */}
        <div className="flex justify-end mb-4">
          <input
            type="text"
            placeholder="Search by name..."
            className="px-4 py-2 border rounded-lg w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Faculty List Table */}
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 border-b">Name</th>
                <th className="p-3 border-b">Email</th>
                <th className="p-3 border-b">Phone Number</th>
                <th className="p-3 border-b">Role</th>
                <th className="p-3 border-b">Status</th>
                <th className="p-3 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {faculty
                .filter((f) =>
                  f.name.toLowerCase().includes(search.toLowerCase())
                )
                .map((f) => (
                  <tr key={f._id} className="hover:bg-gray-50">
                    <td className="p-3 border-b">{f.name}</td>
                    <td className="p-3 border-b">{f.email}</td>
                    <td className="p-3 border-b">{f.phone || "—"}</td>
                    <td className="p-3 border-b">{capitalize(f.role)}</td>
                    <td className="p-3 border-b">
                      {f.approvedAsFaculty ? (
                        <span className="text-green-600 font-medium">
                          Approved
                        </span>
                      ) : (
                        <span className="text-red-600 font-medium">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="p-3 border-b text-center">
                      <button
                        className="text-blue-500 hover:underline mr-4"
                        onClick={() => alert("Edit faculty feature here")}
                      >
                        ✏️
                      </button>
                      <button
                        className="text-red-500 hover:underline"
                        onClick={() => deleteFaculty(f._id)}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Toast Notification */}
      {message && (
        <div
          className="fixed top-16 right-5 px-5 py-3 rounded-xl shadow-lg 
          bg-white/90 backdrop-blur-md border border-gray-200 
          text-gray-800 flex items-center gap-3 z-50 
          animate-slideIn"
        >
          <span>{message}</span>
          <button
            onClick={() => setMessage(null)}
            className="ml-2 text-gray-500 hover:text-gray-700 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes slideIn {
          0% { transform: translateX(120%); opacity: 0; }
          50% { transform: translateX(-10px); opacity: 1; }
          100% { transform: translateX(0); opacity: 1; }
        }
        .animate-slideIn {
          animation: slideIn 0.5s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </section>
  );
};

export default facultyManagement;
