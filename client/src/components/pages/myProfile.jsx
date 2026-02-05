import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../landing/navbar";
import { useAuth } from "../../context/AuthContext";


export default function Profile() {
  const [userr, setUserr] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const BaseUrl = import.meta.env.VITE_BASEURL;


  const {user} = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `${BaseUrl}/api/profile/${user.role}/${user.id}`,
        );
        setUserr(res.data);

      } catch (err) {
        console.error(err);
        setError("Failed to load profile. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // ✅ Cool Loading Animation
  if (loading) {
    return (
      <>
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </>
    );
  }

  // ✅ Error Display
  if (error) {
    return (
      <>
        {/* <Navbar /> */}
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-red-500 font-medium">{error}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex justify-center items-center py-10 px-6 mt-8 bg-gray-100 min-h-screen">
        <div className="bg-white shadow-lg rounded-2xl p-8 max-w-lg w-full border border-gray-200">
          {/* Profile Picture */}
          <div className="flex justify-evenly mb-6">
            <img
              src={userr.data.dpurl || "https://freesvg.org/img/userr-icon.png"}
              alt="Profile"
              className="w-28 h-28 rounded-full border-4 border-blue-500 shadow-md"
            />
            {userr.data.qrCode && (
              <div className="flex justify-center mb-6">
                <img
                  src={userr.data.qrCode}
                  alt="QR Code"
                  className="w-28 h-28 border border-gray-300 shadow-md rounded-sm bg-white"
                />
              </div>
            )}
          </div>

          {/* User Info */}
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-2">
            {userr.data.name}
          </h2>
          <p className="text-center text-gray-500 mb-6 capitalize">
            { userr.response && userr.response.designation || "Student/Faculty"}
          </p>

          {/* Info Grid */}
          <div className="grid grid-cols-1 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl border">
              <p className="text-gray-500 text-sm">Email</p>
              <p className="text-gray-800 font-medium">{userr.data.email}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl border">
              <p className="text-gray-500 text-sm">Phone</p>
              <p className="text-gray-800 font-medium">{userr.data.phone}</p>
            </div>
          </div>

            {/* Additional Details */}  
            <div className="mt-6 p-4 bg-gray-50 rounded-xl border">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Details</h3>
                {userr.response ? (
                    Object.entries(userr.response).map(([key, value]) => (
                    key !== "connectionId" && key !== "_id" && key !== "__v" && (
                        <div key={key} className="mb-3">
                        <p className="text-gray-500 text-sm">{key.charAt(0).toUpperCase() + key.slice(1)}</p>
                        <p className="text-gray-800 font-medium">{value+" " || "N/A"}</p>
                        </div>
                    )
                    ))
                ) : (
                    <p className="text-gray-500">No additional details available.</p>
                )}
            </div>
        </div>
      </div>
    </>
  );
}
