const validator = require("validator");
const geoip = require("geoip-lite");
const useragent = require("useragent");

module.exports = function signupValidator(req, res, next) {

  try {

    const {
      email,
      password,
      name,
      fingerprint,
      company
    } = req.body;

    /* Honeypot trap */
    if (company) {
      return res.status(403).json({
        error: "Bot detected"
      });
    }

    /* Required fields */
    if (!email || !password || !name) {
      return res.status(400).json({
        error: "Missing required fields"
      });
    }

    /* Email validation */
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        error: "Invalid email address"
      });
    }

    /* Password strength */
    if (!validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1
    })) {
      return res.status(400).json({
        error: "Password too weak"
      });
    }

    /* Suspicious email pattern detection */
    const suspiciousPattern = /[0-9]{5,}/;

    if (suspiciousPattern.test(email)) {
      return res.status(403).json({
        error: "Suspicious signup detected"
      });
    }

    /* User-agent check */
    const userAgent = req.headers["user-agent"];

    if (!userAgent) {
      return res.status(403).json({
        error: "Missing client information"
      });
    }

    /* Block known bot agents */
    const botAgents = [
      "curl",
      "wget",
      "python",
      "HeadlessChrome",
      "Puppeteer",
      "Playwright",
      "Selenium"
    ];

    const isBot = botAgents.some(agent =>
      userAgent.toLowerCase().includes(agent.toLowerCase())
    );

    if (isBot) {
      return res.status(403).json({
        error: "Automated signup blocked"
      });
    }

    /* Browser security headers */
    if (!req.headers["sec-fetch-site"]) {
      return res.status(403).json({
        error: "Invalid browser request"
      });
    }

    /* Fingerprint check */
    if (!fingerprint) {
      return res.status(403).json({
        error: "Device verification failed"
      });
    }

    /* Capture IP and location */
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket.remoteAddress;

    const geo = geoip.lookup(ip);

    const agent = useragent.parse(userAgent);

    req.signupMeta = {
      ip,
      country: geo?.country || "unknown",
      city: geo?.city || "unknown",
      browser: agent.toAgent(),
      os: agent.os.toString(),
      device: agent.device.toString()
    };

    next();

  } catch (err) {

    console.error("Signup validation error:", err);

    return res.status(500).json({
      error: "Signup validation failed"
    });

  }
};