const geoip = require("geoip-lite");
const useragent = require("useragent");

function signupLogger(req, res, next) {

  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket.remoteAddress;

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

    Fingerprint: req.body?.fingerprint || "Missing"
  };

  console.log("\n🚨 Signup Attempt Detected");
  console.table(logData);

  next();
}

module.exports = signupLogger;