module.exports = function platformAuth(req, res, next) {

  const key = req.headers["x-platform-key"];
  const origin = req.headers.origin;

  if (origin !== process.env.ALLOWED_ORIGIN) {
    return res.status(403).json({ message: "Blocked origin" });
  }

  if (!key || key !== process.env.PLATFORM_SECRET_KEY) {
    return res.status(403).json({ message: "Unauthorized platform" });
  }

  next();
};