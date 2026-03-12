const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const albumRoutes = require("./routes/albumRoutes");
const platformAuth = require("./middleware/platformAuth");
const http = require("http");
const { Server } = require("socket.io");

const {
  apiLimiter,
  botProtection,
  ipSpamProtection,
  payloadProtection
} = require("./middlewares/securityMiddleware.js");

const app = express();
const PORT = process.env.PORT || 3000;


// GLOBAL SECURITY
app.use(apiLimiter);
app.use(botProtection);
app.use(ipSpamProtection);
app.use(payloadProtection);

app.use(mongoSanitize())

app.use(cors({ origin: "https://ems-akit.netlify.app", credentials: true }));
app.use(cookieParser());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

app.set("io", io);


app.use(express.urlencoded({ extended: true }));


server.listen(PORT, () => {
  console.log(
    `Server is running on ${process.env.VITE_BASEURL_CORS + ":" + PORT}`,
  );
});

// AUTH ROUTES
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// OTP ROUTES
const otpRoutes = require("./routes/otp");
app.use("/api/otp", otpRoutes);

// API Authentication
app.use(platformAuth);

app.get("/", (req, res) => {
  res.send("Reached backend server!");
});

// STUDENT ROUTES
const student = require("./routes/student");
app.use("/api/students", student);

// FACULTY ROUTES
const faculty = require("./routes/faculty");
app.use("/api/faculty", faculty);

// GALERY ROUTES
app.use("/api/gallery", albumRoutes);

// ALBUM ROUTES
const album = require("./routes/album");
app.use("/api/albums", album);

// UPDATE USER ROUTES
const updateUserRoutes = require("./routes/updateDetail");
app.use("/api/user", updateUserRoutes);

// REGISTRATION ROUTES
const register = require("./routes/register");
app.use("/api/view", register);

// PROFILE ROUTES

const profileRoutes = require("./routes/profile");
app.use("/api/profile", profileRoutes);

// ADMIN ROUTES
const adminRoutes = require("./routes/admin");
app.use("/api/admin", adminRoutes);

// RESET PASSWORD
const resetPassword = require("./routes/resetPassword");
app.use("/api/reset-password", resetPassword);

const userScanned = require("./routes/scan");
app.use("/api/scan", userScanned);

const userScannedLibrary = require("./routes/scanLibrary");
app.use("/api/scanLibrary", userScannedLibrary);

//  NEWS ROUTES
const newsRoutes = require("./routes/news");

app.use("/api/news", newsRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).send({ err: "Page not found" });
});

// ✅ ❌
