import { useEffect, useState } from "react";

export default function Approvals() {
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message,setMessage] = useState(null)
  const BaseUrl = import.meta.env.VITE_BASEURL;


  // Fetch pending faculty
  const fetchFaculty = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BaseUrl}/api/admin/faculty`);
      const data = await res.json();
      setFacultyList(data);
    } catch (err) {
      console.error("Error fetching faculty:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, []);
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Approve / Reject faculty
  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(
        `${BaseUrl}/api/admin/approve/faculty/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );
      const data = await res.json();

      if (data) {
        setMessage(data.message);
        fetchFaculty(); // refresh list
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  return (
    <div className="bg-white mt-10 rounded-2xl shadow-xl border border-gray-200 p-6 md:p-8 animate-fadeIn mt-10">
      <h2 className="text-3xl font-bold mb-6">👨‍🏫 Faculty Approvals</h2>

      {loading ? (
        <p>Loading faculty...</p>
      ) : facultyList.length > 0 ? (
        <table className="min-w-full border border-gray-300 rounded-lg shadow">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Phone</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {facultyList.map((f) => (
              <tr key={f._id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{f.name}</td>
                <td className="px-4 py-2 border">{f.email}</td>
                <td className="px-4 py-2 border">{f.phone}</td>
                <td className="px-4 py-2 border">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      f.approvedAsFaculty === true
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {f.approvedAsFaculty === true ? "Approved" : "Pending"}
                  </span>
                </td>
                <td className="px-4 py-2 border flex gap-2">
                  <button
                    onClick={() => updateStatus(f._id, "approved")}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => updateStatus(f._id, "rejected")}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No faculty pending approval ✅</p>
      )}
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
    </div>
  );
}
