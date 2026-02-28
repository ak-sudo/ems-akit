const express = require("express");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const otp = express();

otp.use(express.json());

const BASE_URL = "https://api.textbee.dev/api/v1";

//Akshat's 
// const API_KEY = "7d4b901e-3c07-48f5-97a8-ba994bd09e44";
// const DEVICE_ID = "68bbb3f4c3eec747842325a0";

//Agraj's
const API_KEY = "74e0f64a-06f5-4be9-a59a-380d38e82281";
// const DEVICE_ID = "6996d8d9f8dad099dc8d6112";



let otpStore = {}; // { phone: otp }

// API to send OTP

otp.post("/send-otp", async (req, res) => {
  const { phone } = req.body;

  if (!phone) return res.json({ success: false, message: "Phone required" });

  // Generate random 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[phone] = otp;

  const Data = await axios.post(
    `${BASE_URL}/gateway/devices/${DEVICE_ID}/send-sms`,
    {
      recipients: [`${phone}`],
      message: `EMS AKIT: Sign up OTP : ${otp}.\n
This code is valid for 5 minutes.\n
Do not share this code with anyone.`,
    },
    { headers: { "x-api-key": API_KEY } },
  );

  if (Data.status === 201) {
    return res.json({ success: true, message: "OTP sent" });
  } else {
    return res.json({
      success: false,
      message: "Could not send OTP on phone. Try agin later",
    });
  }
});

otp.post("/email/send-otp", async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    // Generate 6 digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Hash OTP
    const otpHash = await bcrypt.hash(otp, 10);

    // Create JWT (5 min expiry)
    const token = jwt.sign({ email, otpHash }, process.env.JWT_SECRET, {
      expiresIn: "5m",
    });

    // Call EmailJS REST API
    await axios.post(
      "https://api.emailjs.com/api/v1.0/email/send",
      {
        service_id: process.env.EMAILJS_SERVICE_ID,
        template_id: process.env.EMAILJS_TEMPLATE_ID,
        user_id: process.env.EMAILJS_PUBLIC_KEY,
        accessToken: process.env.EMAILJS_PRIVATE_KEY,
        template_params: {
          email: email,
          user_name: name || "User",
          otp_code: otp,
          company_name: "EMS AKIT",
          year: new Date().getFullYear(),
          support_email: "itzakshat706@gmail.com",
          expiry_time: "5 minutes",
        },
      },
      {
        headers: { "Content-Type": "application/json" },
      },
    );

    res.json({ token });
  } catch (error) {
    console.log("EmailJS Error:", error.response?.data || error.message);
    res.status(500).json({ message: "Failed to send OTP on mail id" });
  }
});

otp.post("/email/verify-otp", async (req, res) => {
  try {
    const { email, otp, token } = req.body;

    if (!token) return res.status(400).json({ message: "Token missing" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.email !== email)
      return res.status(400).json({ message: "Invalid email" });

    const isMatch = await bcrypt.compare(otp, decoded.otpHash);

    if (!isMatch) return res.status(400).json({ message: "Invalid Email OTP" });

    res.json({ message: "Email OTP verified successfully" });
  } catch (error) {
    res.status(400).json({ message: "Email OTP expired or invalid" });
  }
});

// API to verify OTP
otp.post("/verify-otp", (req, res) => {
  const { phone, otp } = req.body;
  if (!phone || !otp) {
    return res.json({ success: false, message: "Phone and OTP required" });
  }


  if (otpStore[phone] && otpStore[phone] === otp) {
    delete otpStore[phone]; // OTP use  d once
    return res.json({ success: true, message: "OTP verified successfully" });
  }

  return res.json({ success: false, message: "Invalid OTP" });
});

otp.post("/send-reset-otp", async (req, res) => {
  const { phone } = req.body;

  if (!phone) return res.json({ success: false, message: "Phone required" });

  // Generate random 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[phone] = otp;

  const Data = await axios.post(
    `${BASE_URL}/gateway/devices/${DEVICE_ID}/send-sms`,
    {
      recipients: [`${phone}`],
      message: `EMS AKIT: Your password reset OTP is ${otp}.\n
This code is valid for 5 minutes.\n
Do not share this code with anyone.`,
    },
    { headers: { "x-api-key": API_KEY } },
  );

  if (Data.status === 201) {
    return res.json({ success: true, message: "OTP sent" });
  } else {
    return res.json({
      success: false,
      message: "Could not send OTP on phone. Try agin later",
    });
  }
});

otp.post("/email/send-reset-otp", async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    // Generate 6 digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Hash OTP
    const otpHash = await bcrypt.hash(otp, 10);

    // Create JWT (5 min expiry)
    const token = jwt.sign({ email, otpHash }, process.env.JWT_SECRET, {
      expiresIn: "5m",
    });

    // Call EmailJS REST API
    await axios.post(
      "https://api.emailjs.com/api/v1.0/email/send",
      {
        service_id: process.env.EMAILJS_SERVICE_ID,
        template_id: process.env.EMAILJS_RESET_TEMPLATE_ID,
        user_id: process.env.EMAILJS_PUBLIC_KEY,
        accessToken: process.env.EMAILJS_PRIVATE_KEY,
        template_params: {
          email: email,
          user_name: name || "User",
          otp_code: otp,
          company_name: "EMS AKIT",
          year: new Date().getFullYear(),
          support_email: "itzakshat706@gmail.com",
          expiry_time: "5 minutes",
        },
      },
      {
        headers: { "Content-Type": "application/json" },
      },
    );

    res.json({ token });
  } catch (error) {
    console.log("EmailJS Error:", error.response?.data || error.message);
    res.status(500).json({ message: "Failed to send OTP on mail id" });
  }
});

otp.post("/email/verify-reset-otp", async (req, res) => {
  try {
    const { email, otp, token } = req.body;

    if (!token)
      return res.status(400).json({ success: false, message: "Token missing" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.email !== email)
      return res.status(400).json({ success: false, message: "Invalid email" });

    const isMatch = await bcrypt.compare(otp, decoded.otpHash);

    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: "Invalid Email OTP" });

    res.json({ success: true, message: "Email OTP verified successfully" });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: "Email OTP expired or invalid" });
  }
});

// API to verify OTP
otp.post("/verify-reset-otp", (req, res) => {
  const { phone, otp } = req.body;
  if (!phone || !otp) {
    return res.json({ success: false, message: "Phone and OTP required" });
  }

  if (otpStore[phone] && otpStore[phone] === otp) {
    delete otpStore[phone]; // OTP used once
    return res.json({ success: true, message: "OTP verified successfully" });
  }

  return res.json({ success: false, message: "Invalid OTP" });
});

module.exports = otp;

