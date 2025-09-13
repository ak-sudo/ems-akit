const mongoose = require('mongoose');
const connectDB = require('../connection/connection');
connectDB();

const UserSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    phone: {type: Number, required: true, unique: true},
    password: {type: String, required: true},
    dpurl: {type: String, default: 'https://www.nicepng.com/png/detail/128-1280406_view-user-icon-png-user-circle-icon-png.png'},
    role: {type: String, enum: ['student', 'faculty'], default: ''},
    approvedAsFaculty : {type: Boolean, default: false},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
})

const User = mongoose.model('User', UserSchema);
module.exports = User;
