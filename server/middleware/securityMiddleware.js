import rateLimit from "express-rate-limit";

// In-memory IP tracking (can be replaced with Redis in production)
const ipTracker = new Map();

// disposable / fake domains
const blockedDomains = [
  "example.com",
  "tempmail.com",
  "mailinator.com",
  "10minutemail.com",
  "guerrillamail.com"
];

// -----------------------------
// RATE LIMITER
// -----------------------------
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    success: false,
    message: "Too many requests from this IP. Try again later."
  },
  standardHeaders: true,
  legacyHeaders: false
});


// -----------------------------
// SIGNUP LIMITER (strict)
// -----------------------------
export const signupLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5,
  message: {
    success: false,
    message: "Too many accounts created from this IP."
  }
});


// -----------------------------
// BOT DETECTION
// -----------------------------
export const botProtection = (req, res, next) => {

  const userAgent = req.headers["user-agent"];

  if (!userAgent) {
    return res.status(403).json({
      success: false,
      message: "Blocked request (missing user-agent)"
    });
  }

  const suspiciousAgents = [
    "curl",
    "wget",
    "python",
    "postman",
    "insomnia"
  ];

  for (let agent of suspiciousAgents) {
    if (userAgent.toLowerCase().includes(agent)) {
      return res.status(403).json({
        success: false,
        message: "Automated requests are blocked"
      });
    }
  }

  next();
};


// -----------------------------
// IP SPAM PROTECTION
// -----------------------------
export const ipSpamProtection = (req, res, next) => {

  const ip =
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    req.ip;

  const now = Date.now();

  if (!ipTracker.has(ip)) {
    ipTracker.set(ip, { count: 1, time: now });
    return next();
  }

  const data = ipTracker.get(ip);

  if (now - data.time < 60000) {
    data.count += 1;

    if (data.count > 50) {
      return res.status(429).json({
        success: false,
        message: "Too many requests detected from this IP."
      });
    }
  } else {
    data.count = 1;
    data.time = now;
  }

  ipTracker.set(ip, data);

  next();
};


// -----------------------------
// EMAIL DOMAIN VALIDATION
// -----------------------------
export const emailProtection = (req, res, next) => {

  const { email } = req.body;

  if (!email) return next();

  const domain = email.split("@")[1];

  if (blockedDomains.includes(domain)) {
    return res.status(400).json({
      success: false,
      message: "Disposable email addresses are not allowed."
    });
  }

  next();
};


// -----------------------------
// REQUEST SIZE PROTECTION
// -----------------------------
export const payloadProtection = (req, res, next) => {

  const contentLength = req.headers["content-length"];

  if (contentLength && contentLength > 1024 * 50) {
    return res.status(413).json({
      success: false,
      message: "Payload too large"
    });
  }

  next();
};