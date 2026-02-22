const express = require("express");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/user");

const reset = express();

reset.use(express.json());

let otpStore = {};
const url = process.env.BACKEND_URL;

reset.post("/send", async (req, res) => {
  identifier = req.body.identifier;

  if (identifier.includes("@")) {
    const result = await User.findOne({ email: identifier });
    currDate = new Date();
    if (!result) {
      res
        .status(400)
        .json({
          success: false,
          message: "No account linked with the given email id is registered!",
        });
    } else {
      const resp = await axios.post(`${url}/api/otp/email/send-reset-otp`, {
        email: result.email,
        name: result.name,
      });
      if (!resp) {
        res
          .status(400)
          .json({
            success: false,
            message: "Could not send OTP at the moment",
          });
      } else {
        const otp_token = resp.data.token;
        res.status(200).json({ success: true, otp_token });
      }
    }
  } else {
    const result = await User.findOne({ phone: identifier });

    if (!result) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            "No account linked with the given phone number is registered!",
        });
    } else {
      const respdata = await axios.post(`${url}/api/otp/send-reset-otp`, {phone:identifier});
      if (!respdata.data.success){
        return res.json({success:false, message: 'OTP was not sent'})
      }
      else{
        return res.json({success:true, message: 'OTP sent on mobile number!'})
      }
    }
  }

});

reset.post("/verify", async (req, res) => {
  const data = req.body;

  if (data.identifier.includes("@")) {
    try {
      const resp = await axios.post(`${url}/api/otp/email/verify-reset-otp`, {
        email: data.identifier,
        otp: data.otp,
        token: data.token,
      });
      if (!resp.data.success) {
        return res.json({ success: false, message: "Incorrect OTP Entered!" });
      } else {
        const hashedPass = await bcrypt.hash(data.password, 10);

        const updateUser = await User.findOneAndUpdate(
          { email: data.identifier },
          { $set: { password: hashedPass } },
          { new: true },
        );

        if (updateUser) {
          return res.json({
            success: true,
            message: "Password Updated Successfully! Try loogin in!",
          });
        } else {
          return res.json({
            success: true,
            message: "Password Updated Successfully! Try loogin in!",
          });
        }
      }
    } catch {
      return res.json({ success: false, message: "Incorrect OTP Entered!" });
    }
  } else {
    try {
      const resp = await axios.post(`${url}/api/otp/verify-reset-otp`, {
        phone: data.identifier,
        otp: data.otp,
      });
      if (!resp.data.success) {
        return res.json({ success: false, message: "Incorrect OTP Entered!" });
      } else {
        const hashedPass = await bcrypt.hash(data.password, 10);

        const updateUser = await User.findOneAndUpdate(
          { phone: data.identifier },
          { $set: { password: hashedPass } },
          { new: true },
        );

        if (updateUser) {
          return res.json({
            success: true,
            message: "Password Updated Successfully! Try loggin in!",
          });
        } else {
          return res.json({
            success: false,
            message: "Password Was Not Updated! Try again later!",
          });
        }
      }
    } catch {
      return res.json({ success: false, message: "Incorrect OTP Entered!" });
    }
  }
});

module.exports = reset;
