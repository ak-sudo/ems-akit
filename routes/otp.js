const express = require("express");
const cors = require("cors");
const axios = require("axios");

const otp = express();

otp.use(express.json());

const BASE_URL = "https://api.textbee.dev/api/v1";
const API_KEY = "b67bcb24-95f2-456c-85c7-e72732f821dc";
const DEVICE_ID = "68bbb3f4c3eec747842325a0";


let otpStore = {}; // { phone: otp }

// API to send OTP
otp.post("/send-otp", async (req, res) => {
  const {phone}  = req.body;

  if (!phone) return res.json({ success: false, message: "Phone required" });

  // Generate random 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[phone] = otp;
  const response = await axios.post(
    `${BASE_URL}/gateway/devices/${DEVICE_ID}/send-sms`,
    {
      recipients: [`${phone}`],
      message: `Your OTP is ${otp}. \n
Please do not share this code with anyone. 
It will expire in 5 minutes. 
  ~ EMS - AKIT`,
    },

    { headers: { "x-api-key": API_KEY } }
  );
  console.log(response.data);

  res.json({ success: true, message: "OTP sent" });
});

// API to verify OTP
otp.post("/verify-otp", (req, res) => {
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
