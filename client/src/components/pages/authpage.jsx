  import React, { useState, useEffect, use } from "react";
  import { useNavigate } from "react-router-dom";
  import { decodeToken } from "react-jwt";
  import Footer from "../landing/footer";
  import { createCookie } from "react-router-dom";
  import { useAuth } from "../../context/AuthContext";
  import { Database } from "lucide-react";


  export default function AuthPage() {

    const navigate = useNavigate();
    const {login} = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [message, setMessage] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const BaseUrl = import.meta.env.VITE_BASEURL;
    const [formData, setFormData] = useState({
      name: "",
      email: "",
      phone: "",
      countryCode: "+91",
      password: "",
      role: "",
      dpurl:
        "https://www.nicepng.com/png/detail/128-1280406_view-user-icon-png-user-circle-icon-png.png",
    });
    const [errors, setErrors] = useState({});
    const [otpSent, setOtpSent] = useState(false);
    const [otpValue, setOtpValue] = useState("");
    const [otpVerified, setOtpVerified] = useState(false);

    // Handle input change
    const handleChange = async (e) => {
      const { name, value, files } = e.target;

      if (name === "dpurl") {
        const file = files[0];
        if (file && file.size > 10 * 1024 * 1024) {
          setErrors({ ...errors, dpurl: "File size must be less than 10MB" });
          return;
        }

        setErrors({ ...errors, dpurl: "" });

        // Upload to Cloudinary
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "profile_pics");

        try {
          const res = await fetch(
            `https://api.cloudinary.com/v1_1/dcirxmhrs/image/upload`,
            {
              method: "POST",
              body: data,
            }
          );

          const result = await res.json();
          setFormData({ ...formData, dpurl: result.secure_url });
        } catch (err) {
          console.log("Cloudinary upload error:", err);
        }
      } else {
        setFormData({ ...formData, [name]: value });

        // Trigger OTP send when phone number is valid
        if (name === "phone" && /^\d{10}$/.test(value)) {
          sendOtp(formData.countryCode + value);
        }
      }
    };

    // Send OTP
    const sendOtp = async (fullPhone) => {
      try {
        const res = await fetch(`${BaseUrl}/api/otp/send-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: fullPhone }),
          credentials: 'include'
        });
        const data = await res.json();

        if (data.success) {
          setOtpSent(true);
          setMessage(`OTP sent to ${fullPhone}`);
        }
      } catch (err) {
        console.error("Error sending OTP:", err);
      }
    };

    // Verify OTP
    const verifyOtp = async () => {
      try {
        const fullPhone = formData.countryCode + formData.phone;
        const res = await fetch(`${BaseUrl}/api/otp/verify-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: fullPhone, otp: otpValue }),
          credentials: 'include'

        });
        const data = await res.json();
        if (data.success === true) {
          setOtpVerified(true);
          setMessage("Phone verified ✅");
          let getPhoneInput = document.querySelector("#phone");
          getPhoneInput.disabled = true;
        } else {
          setMessage("Invalid OTP ❌");
        }
      } catch (err) {
        console.error("Error verifying OTP:", err);
      }
    };

    // Validation
    const validate = () => {
      let newErrors = {};
      if (!isLogin && !formData.name) newErrors.name = "Name is required";
      if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
        newErrors.email = "Invalid email";
      if (!isLogin && !/^\d{10}$/.test(formData.phone))
        newErrors.phone = "Mobile must be 10 digits";
      if (!formData.password || formData.password.length < 6)
        newErrors.password = "Password must be at least 6 characters";
      if (!isLogin && !formData.role) newErrors.role = "Please select role";
      if (!isLogin && !formData.dpurl)
        newErrors.dpurl = "Profile photo is required (max 10MB)";
      return newErrors;
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      const validationErrors = validate();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        console.log(Object.values(validationErrors))
        setErrors(Object.values(validationErrors))
        return;
      }

      if (!isLogin && !otpVerified) {
        setMessage("Please verify your phone number OTP before signing up ❌");
        return;
      }

      const fullPhone = formData.countryCode + formData.phone;
      const payload = { ...formData, phone: fullPhone };

      const response = await fetch(
        `${BaseUrl}/api/auth/${isLogin ? "login" : "signup"}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          credentials: 'include'
        }
      );
      setSubmitted(true)


      const data = await response.json();    

      if (!data.err) {
        setErrors({})
        if (isLogin) {
          const resp = await fetch(`${BaseUrl}/api/auth/verify`,{credentials:'include'})
          const getUser = await resp.json()

          if (getUser.user.role === "faculty" && !getUser.user.approved) {
            setMessage(
              "⚠️ Approval by admin is still pending! Once approved you will be logged in"
            );
          } else {
            localStorage.setItem('isLoggedIn',true)
            login()
            setSubmitted(false)
            navigate("/");
          }
        } else {
          setMessage("✅ Registered successfully! Please login now.");
          setIsLogin(true);
          setSubmitted(false)
        }
      } else {
        setMessage(data.err);
        setSubmitted(false)

      }
    };

    useEffect(() => {
      if (message) {
        const timer = setTimeout(() => setMessage(null), 3000);
        return () => clearTimeout(timer);
      }
    }, [message]);

    return (
      <>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200 px-4">
          <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-2">
              {isLogin ? "Login" : "Register"}
            </h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {!isLogin && (
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  className="w-full px-4 py-3 border rounded-xl"
                  value={formData.name}
                  onChange={handleChange}
                />
              )}

              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full px-4 py-3 border rounded-xl"
                value={formData.email}
                onChange={handleChange}
              />

              {!isLogin && (
                <div>
                  <div className="flex space-x-2">
                    <select
                      name="countryCode"
                      value={formData.countryCode}
                      onChange={handleChange}
                      className="px-3 py-3 border rounded-xl"
                    >
                      <option value="+91">🇮🇳 +91</option>
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+44">🇬🇧 +44</option>
                      <option value="+61">🇦🇺 +61</option>
                    </select>
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      placeholder="Mobile Number"
                      className="flex-1 px-4 py-3 border rounded-xl"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Show OTP field automatically if phone is 10 digits */}
                  {formData.phone.length === 10 && !otpVerified && (
                    <div className="mt-2 flex space-x-2">
                      <input
                        type="text"
                        placeholder="Enter OTP"
                        value={otpValue}
                        onChange={(e) => setOtpValue(e.target.value)}
                        className="flex-1 px-3 py-2 border rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={verifyOtp}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
                      >
                        Verify
                      </button>
                    </div>
                  )}

                  {otpVerified && (
                    <p className="text-green-600 text-sm mt-1">
                      ✅ Phone verified
                    </p>
                  )}
                </div>
              )}

              {!isLogin && (
                <>
                  <input
                    type="file"
                    name="dpurl"
                    accept="image/*"
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-xl"
                  />
                  {errors.dpurl && (
                    <p className="text-red-500 text-sm mt-1">{errors.dpurl}</p>
                  )}
                </>
              )}

              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full px-4 py-3 border rounded-xl"
                value={formData.password}
                onChange={handleChange}
              />

              {!isLogin && (
                <select
                  name="role"
                  className="w-full px-4 py-3 border rounded-xl"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="">Select Role</option>
                  <option value="student">Student</option>
                  <option value="faculty">Faculty</option>
                </select>
              )}

              {Object.entries(errors).map(([key, value]) => (
                value && <p key={key} className="text-red-500 text-sm">{'*'+value}</p>
              ))}

              <button
                type="submit"
                disabled={!isLogin && !otpVerified}
                className={`w-full py-3 rounded-xl font-semibold transition ${
                  (!isLogin && !otpVerified || submitted && validate().length>0)
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                {isLogin ? `${submitted ? 'Logging In': 'Log In'}` :  `${submitted ? 'Signing you up': 'Sign Up'}`  }

              </button>
            </form>

            <p className="text-center mt-6 text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-indigo-600 font-semibold"
              >
                {isLogin ? `Sign Up` : `Log In` }
                
              </button>
            </p>
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
      </>
    );
  }
