const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const albumRoutes = require("./routes/albumRoutes");


const app = express();
const PORT = process.env.PORT || 3000;


app.use(
  cors({ origin: 'http://localhost:5173', credentials: true})
  
);
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.listen(PORT, () => {
    console.log(`Server is running on ${
        process.env.VITE_BASEURL_CORS+':'+PORT}`);
});

app.get('/', (req,res)=>{
    res.send('Reached backend server!');
})

// STUDENT ROUTES
const student = require("./routes/student")
app.use("/api/students", student)

// FACULTY ROUTES
const faculty = require('./routes/faculty')
app.use('/api/faculty', faculty)

// GALERY ROUTES
app.use("/api/gallery", albumRoutes);

// ALBUM ROUTES
const album = require('./routes/album');
app.use('/api/albums', album);

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

// RESET PASSWORD
const resetPassword = require('./routes/resetPassword')
app.use('/api/reset-password', resetPassword)

//  NEWS ROUTES
const newsRoutes = require('./routes/news');

app.use('/api/news',newsRoutes)

// 404 handler
app.use((req,res,next)=>{
    res.status(404).send({err: 'Page not found'});
})

// ✅ ❌
