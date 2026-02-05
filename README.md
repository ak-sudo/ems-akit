# EMS-Development
This reposititory is built just for the development and enhancement in EMS - AKIT feature and working.



A production-ready full stack web application built using the **MERN stack** with secure **cookie-based authentication**, **role-based access control**, and a scalable architecture designed for collaborative development.

This repository contains both:

• Client (React frontend)  
• Server (Node/Express backend)

Built with security, performance, and clean structure in mind.

---

## Features

- JWT Authentication using HTTP-only Cookies
- User Profiles
- Role-Based Access (User / Volunteer / Admin)
- Admin Dashboard
- Events System
- Volunteer Dashboard
- Protected Routes
- REST API
- Fast React + Vite Frontend
- MongoDB Database
- Global Auth State using React Context
- No localStorage tokens (secure approach)

---

## Tech Stack

### Frontend
- React
- React Router
- Context API
- Tailwind CSS
- Vite

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Cookie Parser
- CORS

---

## 📂 Project Structure

```
EMS(AKIT)/
│
├── .github/                         # GitHub configs / workflows
│
├── client/                          # React Frontend (Vite)
│   ├── public/
│   ├── src/
│   │   ├── assets/                  # Images / static files
│   │   ├── components/
│   │   │   ├── config/
│   │   │   ├── landing/             # Navbar, Footer, etc.
│   │   │   └── pages/               # Route pages
│   │   │       ├── adminDashboard.jsx
│   │   │       ├── approvals.jsx
│   │   │       ├── authpage.jsx
│   │   │       ├── createEventForm.jsx
│   │   │       ├── EventPage.jsx
│   │   │       ├── galleryAdmin.jsx
│   │   │       ├── home.jsx
│   │   │       ├── myProfile.jsx
│   │   │       ├── news.jsx
│   │   │       ├── registrations.jsx
│   │   │       ├── updateProfile.jsx
│   │   │       ├── volunteer.jsx
│   │   │       ├── facultyManagement.jsx
│   │   │       ├── facultySearch.jsx
│   │   │       ├── studentManagement.jsx
│   │   │       ├── toast.jsx
│   │   │       └── useToast.jsx
│   │   │
│   │   ├── context/                 # AuthContext / global state
│   │   ├── data/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── global styles
│   │
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── eslint.config.js
│
├── server/                          # Node + Express Backend
│   ├── config/                      # App configs
│   ├── connection/                  # Database connection
│   ├── controllers/                 # Business logic
│   │   └── albumController.js
│   │
│   ├── middleware/
│   │   └── verifyToken.js           # JWT auth middleware
│   │
│   ├── models/                      # Mongoose schemas
│   │
│   ├── routes/                      # API routes
│   │   ├── admin.js
│   │   ├── album.js
│   │   ├── albumRoutes.js
│   │   ├── auth.js
│   │   ├── faculty.js
│   │   ├── news.js
│   │   ├── otp.js
│   │   ├── profile.js
│   │   ├── register.js
│   │   ├── student.js
│   │   └── updateDetail.js
│   │
│   ├── utils/
│   ├── index.js                     # Server entry point
│   ├── test.js
│   └── package.json
│
├── README.md
└── .gitignore
```


---

## Local Setup

### Clone the repository

```bash
git clone https://github.com/ak-sudo/EMS-Development.git
cd EMS-Development

cd client
npm install

cd ../server
npm install
```

### To start the backend server 
Make sure you have nodemon package installed

```bash 
nodemon index.js
```

### Backend .env 
Paste these environment variables as it is

```bash
PORT=3000
MONGO_URI=mongodb+srv://itzakshat706:7xenP5Xcqv9kppHJ@akitcluster.q5t2lgp.mongodb.net/EMS-AKIT
JWT_SECRET=itIsaJwtSecretKey

VITE_APPWRITE_PROJECT_ID=68ba5b8f0039a61e679f
VITE_APPWRITE_PROJECT_NAME=EMS-otp
VITE_APPWRITE_ENDPOINT=https://nyc.cloud.appwrite.io/v1
CLOUDINARY_CLOUD_NAME=dcirxmhrs
CLOUDINARY_API_KEY=977491725375441
CLOUDINARY_API_SECRET=ady3L22xsY7NMSPUCH34-MMyB-0

VITE_BASEURL_CORS=http://localhost:5173/
```

### Frontend .env 
Paste these environment variables as it is


```bash
VITE_BASEURL=http://localhost:3000
```

### To start the frontend server 
## Do create the .env file for both the frontend as well as the backend before running the servers online.

Make sure you have all the requires packages installed

```bash 
npm run dev
```

### Only if something breaks (clean install) [It just reset everything and reinstall cleanly]
```bash
rm -rf node_modules package-lock.json
npm install
```
