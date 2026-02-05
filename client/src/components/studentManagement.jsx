import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pencil, Trash2, UserPlus, Search } from "lucide-react";

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    file: null,
    password: "",
    role: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState(null);
  const BaseUrl = import.meta.env.VITE_BASEURL;

  // Fetch students
  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const fetchStudents = async () => {
    try {
      const { data } = await axios.get(
        `${BaseUrl}/api/admin/allStudents`
      );
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students", error);
    }
  };

  // Admin Add Student
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Combine country code + phone for backend
      const fullPhone = ('+91' + form.phone);

      // Payload as expected by signup API
      const payload = {
        name: form.name,
        email: form.email,
        phone: fullPhone,
        password: form.password,
        role: form.role || "student", // default to student
        // You can add more fields here if needed
      };

      const response = await fetch(`${BaseUrl}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log(data)

      if (!data.err) {
        setMessage("✅ Student added successfully!");
        // Reset form
        setForm({
          name: "",
          email: "",
          countryCode: "+91",
          phone: "",
          password: "",
          role: "student",
        });
        fetchStudents();
      } else {
        setMessage(`❌ ${data.err}`);
      }
    } catch (error) {
      console.error("Error adding student:", error);
      setMessage("❌ Something went wrong while adding the student.");
    }
  };

  // Delete Student
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?"))
      return;
    try {
      await axios.delete(`${BaseUrl}/api/students/${id}`);
      fetchStudents();
    } catch (error) {
      console.error("Error deleting student", error);
    }
  };

  // Fill form for editing
  const handleEdit = (student) => {
    setForm({
      name: student.name,
      email: student.email,
      phone: student.phone || "",
      file: null, // cannot prefill file
      password: "", // security: don’t prefill password
      role: student.role || "",
    });
    setEditingId(student._id);
  };

  // Filtered students
  const filteredStudents = students.filter((student) =>
    student.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto p-6 mt-10 space-y-8">
      {/* Form Section */}
      <div className="bg-gray-50 shadow-md rounded-xl p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-blue-600" />
          {editingId ? "Update User" : "Add User"}
        </h2>

        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <input
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="tel"
            placeholder="Mobile Number"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="file"
            onChange={(e) => setForm({ ...form, file: e.target.files[0] })}
            className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 opacity-[0.3] cursor-not-allowed"
            disabled
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500"
            required={!editingId} // only required when adding
          />
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Role</option>
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
            <option value="admin">Admin</option>
          </select>

          <button
            type="submit"
            className="col-span-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
          >
            {editingId ? "Update User" : "Add User"}
          </button>
        </form>
      </div>

      {/* User List */}
      <div className="bg-gray-50 shadow-md rounded-xl p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
          <h2 className="text-xl font-bold text-gray-800">User List</h2>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg w-full focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto max-h-[400px] overflow-y-scroll">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Roll Number</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{student.name}</td>
                  <td className="p-3">
                    <a href={`mailto:${student.email}`}>
                      <u>{student.email}</u>
                    </a>
                  </td>
                  <td className="p-3">{student.roll}</td>
                  <td className="p-3 flex justify-end gap-3">
                    <button
                      onClick={() => handleEdit(student)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(student._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center text-gray-500 py-4">
                    No users found.
                  </td>
                </tr>
              )}
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
    </div>
  );
};

export default StudentManagement;
