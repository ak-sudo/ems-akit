// UpdateProfile.jsx
import {  useEffect, useState } from "react";
import Navbar from "../landing/navbar";
import Footer from "../landing/footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";


export default function UpdateProfile() {
  const navigate = useNavigate();


  const {user} = useAuth();

  const userRole = user.role;
  const BaseUrl = import.meta.env.VITE_BASEURL;

  const [formData, setFormData] = useState({
    connectionId: "",
    branch: "",
    year: "",
    rollNumber: "",
    semester: "",
    fatherName: "",
    hobbies: [],
    department: "",
    highestQualification: "",
    experience: "",
    specialization: "",
    dob: "",
  });

  const [showHobbiesDropdown, setShowHobbiesDropdown] = useState(false);
  const [toast, setToast] = useState(null); // ⬅️ Toast state

  useEffect(() => {
      const fetchProfileData = async () => {
        const res = await axios.get(
          `${BaseUrl}/api/profile/update/${user.role}/${user.id}`
        );
        setFormData(res.data);
        } 
      fetchProfileData();
    }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userRole === "student") {
      if (
        !formData.branch ||
        !formData.year ||
        !formData.rollNumber ||
        !formData.semester ||
        !formData.fatherName ||
        formData.hobbies.length === 0 ||
        !formData.dob
      ) {
        setToast({ type: "error", message: "⚠️ Please fill all the fields" });
        return;
      } else {
        const resp = await fetch(
          `${BaseUrl}/api/user/student/${user.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              connectionId: formData.connectionId,
              branch: formData.branch,
              year: formData.year,
              rollNumber: formData.rollNumber,
              semester: formData.semester,
              fatherName: formData.fatherName,
              hobbies: formData.hobbies,
              dob: formData.dob,
            }),
          }
        );

        const data = await resp.json();
        if (data.err) {
          setToast({ type: "error", message: `❌ ${data.err}` });
          return;
        } else {
          setToast({
            type: "success",
            message: "✅ Profile updated successfully",
          });
          setTimeout(() => {
            navigate("/myProfile");
          }, 2000);
        }
      }
    } else if (userRole === "faculty") {
      if (
        !formData.department ||
        !formData.highestQualification ||
        !formData.experience ||
        !formData.specialization ||
        !formData.dob
      ) {
        setToast({ type: "error", message: "⚠️ Please fill all the fields" });
        return;
      } else {
        const resp = await fetch(
          `${BaseUrl}/api/user/faculty/${user.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              connectionId: formData.connectionId,
              department: formData.department,
              highestQualification: formData.highestQualification,
              experience: formData.experience,
              specialization: formData.specialization,
              dob: formData.dob,
            }),
          }
        );

        const data = await resp.json();
        if (data.err) {
          setToast({ type: "error", message: `❌ ${data.err}` });
          return;
        } else {
          setToast({
            type: "success",
            message: "✅ Profile updated successfully",
          });
                    setTimeout(() => {
            navigate("/myProfile");
          }, 2000);
        }
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <>
      <div className="flex justify-center items-center p-6 min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden mt-10">
        {/* Glowing background elements */}
        <div className="absolute w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse -top-10 -left-10"></div>
        <div className="absolute w-72 h-72 bg-purple-400/20 rounded-full blur-3xl animate-pulse -bottom-10 -right-10"></div>

        {/* Profile Card */}
        <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-8 transition hover:shadow-2xl relative z-10 border border-gray-100">
          {/* Profile Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="relative">
              <img
                src={user.dp}
                alt="Profile"
                className="h-24 w-24 rounded-full object-cover shadow-md border-4 border-blue-500 hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute bottom-0 right-0 h-4 w-4 bg-green-500 border-2 border-white rounded-full animate-ping"></span>
              <span className="absolute bottom-0 right-0 h-4 w-4 bg-green-500 border-2 border-white rounded-full"></span>
            </div>
            <h2 className="text-xl md:text-2xl font-semibold mt-4 text-gray-900 tracking-wide">
              {user.email}
            </h2>
            <p className="text-blue-600 font-medium text-sm md:text-base capitalize mt-1">
              {userRole}
            </p>
          </div>

          <h3 className="text-lg font-bold mb-6 text-gray-700 text-center border-b pb-2">
            Update Your Profile Details
          </h3>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            {userRole === "student" && (
              <>
                {/* Branch Dropdown */}
                <select
                  name="branch"
                  value={formData.branch || ''}
                  onChange={handleChange}
                  className="border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 p-3 rounded-lg w-full transition bg-white"
                >
                  <option value="">Select Branch</option>
                  <option value="AI/ML">AI/ML</option>
                  <option value="COMPUTER SCIENCE">COMPUTER SCIENCE</option>
                  <option value="ROBOTICS">ROBOTICS</option>
                  <option value="MECHANICAL">MECHANICAL</option>
                  <option value="CIVIL">CIVIL</option>
                </select>

                {/* Year Dropdown */}
                <select
                  name="year"
                  value={formData.year || ''}
                  onChange={handleChange}
                  className="border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 p-3 rounded-lg w-full transition bg-white"
                >
                  <option value="">Select Year</option>
                  <option value="I">I</option>
                  <option value="II">II</option>
                  <option value="III">III</option>
                  <option value="IV">IV</option>
                </select>

                <input 
                  type="text"
                  name="rollNumber"
                  placeholder="Roll Number"
                  value={formData.rollNumber || ''}
                  onChange={handleChange}
                  className="border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 p-3 rounded-lg w-full transition"
                />

                {/* Semester Dropdown */}
                <select
                  name="semester"
                  value={formData.semester || ''}
                  onChange={handleChange}
                  className="border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 p-3 rounded-lg w-full transition bg-white"
                >
                  <option value="">Select Semester</option>
                  <option value="I">I</option>
                  <option value="II">II</option>
                  <option value="III">III</option>
                  <option value="IV">IV</option>
                  <option value="V">V</option>
                  <option value="VI">VI</option>
                  <option value="VII">VII</option>
                  <option value="VIII">VIII</option>
                </select>

                <input
                  type="text"
                  name="fatherName"
                  placeholder="Father's Name"
                  value={formData.fatherName || ''}
                  onChange={handleChange}
                  className="border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 p-3 rounded-lg w-full transition"
                />
                <div className="relative col-span-1 md:col-span-2">
                  <label className="block text-gray-700 font-medium mb-1">
                    Date Of Birth (dd/mm/yyyy)
                  </label>
                  <input
                    type="date"
                    name="dob"
                    placeholder="Select a Date"
                    value={formData.dob || ''}
                    onChange={handleChange}
                    className="border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 p-3 rounded-lg w-full transition w-full"
                  />
                </div>

                {/* Hobbies - Multi Select Dropdown */}
                <div className="relative col-span-1 md:col-span-2">
                  <label className="block text-gray-700 font-medium mb-1">
                    Hobbies
                  </label>
                  <div
                    className="border border-gray-200 rounded-lg p-3 cursor-pointer bg-white focus-within:ring-2 focus-within:ring-blue-100 relative"
                    onClick={() => setShowHobbiesDropdown(!showHobbiesDropdown)}
                  >
                    <span className="text-gray-700">
                      {Array.isArray(formData.hobbies) && formData.hobbies.length > 0
                        ? formData.hobbies.join(", ")
                        : "Select your hobbies"}
                    </span>
                  </div>

                  {/* Dropdown */}
                  {showHobbiesDropdown && (
                    <div className="relative mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto  animate-fadeIn">
                      {[
                        "Athletics",
                        "Cultural - Singing",
                        "Cultural - Dancing",
                        "Cultural - Act or play",
                        "Cultural - Debate",
                        "Cultural - Poetry",
                        "Cultural - Speech",
                        "Cultural - Playing Instruments",
                        "Tech - Front-end development",
                        "Tech - Back-end development",
                        "Tech - Full stack development",
                        "Tech - Competitive programing",
                        "Tech - Prompt engineer",
                        "Tech - 3d modelling",
                        "Tech - Photography/videography",
                        "Tech - Editing(VFX/SFX)",
                        "Sport - Chess",
                        "Sport - Carrom",
                        "Sport - Table tennis",
                        "Sport - Badminton",
                        "Sport - Volleyball",
                        "Sport - Cricket",
                        "Esport - Clash of clans",
                        "Esport - Asphalt",
                        "Esport - Valorant",
                        "Esport - Battleground Mobile India",
                        "Esport - Free Fire",
                        "Esport - FIFA",
                      ].map((hobby) => (
                        <label
                          key={hobby}
                          className="flex items-center gap-2 px-4 py-2 z-20 hover:bg-gray-100 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={(formData.hobbies || []).includes(hobby)}
                            onChange={(e) => {
                              let updatedHobbies =[...(formData.hobbies || [])];;
                              if (e.target.checked) {
                                updatedHobbies.push(hobby);
                              } else {
                                updatedHobbies = updatedHobbies.filter(
                                  (h) => h !== hobby
                                );
                              }
                              setFormData({
                                ...formData,
                                hobbies: updatedHobbies,
                              });
                            }}
                          />
                          <span className="text-gray-700">{hobby}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {userRole === "faculty" && (
              <>
                {/* Department Dropdown */}
                <select
                  name="department"
                  value={formData.department || ''}
                  onChange={handleChange}
                  className="border border-gray-200 focus:border-blue-500 focus:ring-2 
                 focus:ring-blue-100 p-3 rounded-lg w-full transition bg-white"
                >
                  <option value="">Select Department</option>
                  <option value="AI/ML">AI/ML</option>
                  <option value="COMPUTER SCIENCE">Computer Science</option>
                  <option value="ROBOTICS">Robotics</option>
                  <option value="MECHANICAL">Mechanical</option>
                  <option value="CIVIL">Civil</option>
                </select>

                {/* Highest Qualification Dropdown */}
                <select
                  name="highestQualification"
                  value={formData.highestQualification || ''}
                  onChange={handleChange}
                  className="border border-gray-200 focus:border-blue-500 focus:ring-2 
                 focus:ring-blue-100 p-3 rounded-lg w-full transition bg-white"
                >
                  <option value="">Select Highest Qualification</option>
                  <option value="B.Tech.">B.Tech.</option>
                  <option value="M.Tech">M.Tech</option>
                  <option value="Phd.">PhD.</option>
                </select>

                {/* Experience Dropdown */}
                <select
                  name="experience"
                  value={formData.experience || ''}
                  onChange={handleChange}
                  className="border border-gray-200 focus:border-blue-500 focus:ring-2 
                 focus:ring-blue-100 p-3 rounded-lg w-full transition bg-white"
                >
                  <option value="">Select Experience</option>
                  <option value="1">1 Year</option>
                  <option value="2">2 Years</option>
                  <option value="3">3 Years</option>
                  <option value="4">4 Years</option>
                  <option value="5+">5+ Years</option>
                  <option value="10+">10+ Years</option>
                </select>

                {/* Specialization (kept as text input) */}
                <input
                  type="text"
                  name="specialization"
                  placeholder="Specialization"
                  value={formData.specialization || ''}
                  onChange={handleChange}
                  className="border border-gray-200 focus:border-blue-500 focus:ring-2 
                 focus:ring-blue-100 p-3 rounded-lg w-full transition"
                />

                <div className="relative col-span-1 md:col-span-2">
                  <label className="block text-gray-700 font-medium mb-1">
                    Date Of Birth (dd/mm/yyyy)
                  </label>
                  <input
                    type="date"
                    name="dob"
                    placeholder="Select a Date"
                    value={formData.dob || ''}
                    onChange={handleChange}
                    className="border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 p-3 rounded-lg w-full transition w-full"
                  />
                </div>
              </>
            )}

            <div className="col-span-1 md:col-span-2 flex justify-center mt-6">
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-8 py-3 rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition transform"
              >
                Update Profile
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-5 right-5 px-5 py-3 rounded-lg shadow-lg 
          ${
            toast.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          } 
          animate-fadeIn z-50 flex items-center gap-3`}
        >
          <span>{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="ml-3 font-bold hover:opacity-80"
          >
            ✕
          </button>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </>
  );
}
