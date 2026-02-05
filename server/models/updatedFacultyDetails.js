const {mongoose,Schema} = require('mongoose');
const connectDB = require('../connection/connection');


const updateFacultySchemaa = new Schema({
    connectionId: {type: String, required: true, unique: true},
    department: {type: String},
    designation: {type: String, default: "Faculty"},
    highestQualification: {type: String},
    experience: {type: String},
    specialization: {type: String},
    dob: {type: String},
    
})

const updateFacultyDetail = mongoose.model('updateFaculty', updateFacultySchemaa);
module.exports = updateFacultyDetail;