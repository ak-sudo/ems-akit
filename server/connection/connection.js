const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  try {
    // Use Atlas URI if provided, else fallback to localhost
    const mongoURI = process.env.MONGO_URI;

    const conn = await mongoose.connect(mongoURI, {connectTimeoutMS: 60000,
    maxPoolSize: 50,
    minPoolSize: 10,
    serverSelectionTimeoutMS: 60000
  });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }

};

module.exports =  connectDB;
