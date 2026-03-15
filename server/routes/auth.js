const express = require("express");
const cors = require("cors");
const auth = express();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const verifyToken = require("../middleware/verifyToken");
const geoip = require("geoip-lite");
const useragent = require("useragent");
// const {
//   signupLimiter,
//   emailProtection
// } = require("../middleware/");

auth.post("/signup", async (req, res) => {
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;

  const geo = geoip.lookup(ip) || {};

  const agent = useragent.parse(req.headers["user-agent"] || "");

  const logData = {
    Time: new Date().toISOString(),
    Endpoint: req.originalUrl,
    Method: req.method,

    IP: ip,
    Country: geo.country || "Unknown",
    City: geo.city || "Unknown",

    Browser: agent.family || "Unknown",
    OS: agent.os.toString() || "Unknown",
    Device: agent.device.toString() || "Unknown",

    EmailAttempted: req.body?.email || "N/A",

    UserAgent: req.headers["user-agent"] || "Missing",

    SecFetchSite: req.headers["sec-fetch-site"] || "Missing",
    SecFetchMode: req.headers["sec-fetch-mode"] || "Missing",
    Origin: req.headers["origin"] || "Missing",
    Referer: req.headers["referer"] || "Missing",

    Fingerprint: req.body?.fingerprint || "Missing",
  };

  const details = req.body;
  const haveVerifiedEmail = details.haveVerifiedEmail;

  if (!haveVerifiedEmail) {
    console.log(
      "Email verification pending for user with email:",
      details.email,
    );
    console.table(logData);
    return res
      .status(400)
      .send({ err: "Please verify your email before signing up!" });
  }

  let hashedPassword = await bcrypt.hash(details.password, 10);
  details.password = hashedPassword;

  const user = new User(details);
  savedUser = await user.save();
  if (savedUser) {
    return res.status(200).send({ success: "User signed up successfully" });
  } else {
    return res.status(400).send({ err: "Error signing up user" });
  }
});

auth.post("/login", async (req, res) => {
  const details = req.body;

  getUser = await User.findOne({ email: details.email });

  if (getUser) {
    matchHatchPwd = await bcrypt.compare(details.password, getUser.password);

    if (matchHatchPwd) {
      const isApproved = getUser.approvedAsFaculty;

      if (getUser.role === "faculty" && isApproved) {
        const token = jwt.sign(
          {
            id: getUser._id,
            email: getUser.email,
            role: getUser.role,
            dp: getUser.dpurl,
            approved: isApproved,
          },
          process.env.JWT_SECRET,
        );

        //   res.cookie("isLoggedIn", true);
        res.cookie("token", token, {
          maxAge: 3600000,
          httpOnly: true,
          secure: true,
          sameSite: "none",
          path: "/",
        });

        return res.status(200).json({
          msg: "User logged in successfully",
          user: {
            id: getUser._id,
            email: getUser.email,
            role: getUser.role,
            dp: getUser.dpurl,
            approved: isApproved,
          },
        });
      }
      if (getUser.role && getUser.role !== "faculty") {
        const token = jwt.sign(
          {
            id: getUser._id,
            email: getUser.email,
            role: getUser.role,
            dp: getUser.dpurl,
            approved: isApproved,
          },
          process.env.JWT_SECRET,
        );

        //   res.cookie("isLoggedIn", true);
        res.cookie("token", token, {
          maxAge: 3600000,
          httpOnly: true,
          secure: true,
          sameSite: "none",
          path: "/",
        });
        return res.status(200).json({
          msg: "Logged In Successfully",
          user: {
            id: getUser._id,
            email: getUser.email,
            role: getUser.role,
            dp: getUser.dpurl,
            approved: isApproved,
          },
        });
      } else {
        return res.status(401).json({
          msg: "Approval by admin is still pending! Once approved you will be logged in",
          user: {
            id: getUser._id,
            email: getUser.email,
            role: getUser.role,
            dp: getUser.dpurl,
            approved: isApproved,
          },
        });
      }
    } else {
      return res.status(400).send({
        err: "Incorrect email or password entered! Please try again.",
      });
    }
  } else {
    res
      .status(400)
      .send({ err: "Incorrect email or password entered! Please try again." });
  }
});

// /api/auth/verify
auth.get("/verify", verifyToken, (req, res) => {
  return res.json({ user: req.user });
});

auth.get("/logout", (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });

    return res.json({ success: "Logged Out" });
  } catch {
    return res.json({ fail: "Could not log you out at the moment!" });
  }
});

module.exports = auth;
