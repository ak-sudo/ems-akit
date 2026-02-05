const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    // 1️⃣ get token from cookie
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Not authenticated. Token missing",
      });
    }

    // 2️⃣ verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3️⃣ attach user data to request
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

module.exports = verifyToken;