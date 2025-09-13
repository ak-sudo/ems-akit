const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./connection/connection')

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  "http://localhost:3000",
  "https://ems-akit.netlify.app"
];

app.use(
  cors({ origin: "https://ems-akit.netlify.app" || "http://localhost:5173" })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.get('/', (req,res)=>{
    res.send('Reached backend server!');
})  

// AUTH ROUTES
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// OTP ROUTES
const otpRoutes = require('./routes/otp');
app.use('/api/otp', otpRoutes);

// UPDATE USER ROUTES
const updateUserRoutes = require('./routes/updateDetail');
app.use('/api/user', updateUserRoutes);

// REGISTRATION ROUTES
const register = require('./routes/register')
app.use('/api/view', register)

// PROFILE ROUTES

const profileRoutes = require('./routes/profile');
app.use('/api/profile', profileRoutes);

// ADMIN ROUTES
const adminRoutes = require('./routes/admin')
app.use('/api/admin', adminRoutes)

//  NEWS ROUTES
const newsRoutes = require('./routes/news')
app.use('/api/news',newsRoutes)

// 404 handler
app.use((req,res,next)=>{
    res.status(404).send({err: 'Page not found'});
})

// ✅ ❌
