const {mongoose,Schema} = require('mongoose');
const connectDB = require('../connection/connection');

const updatedStudentSchema = new Schema({
    connectionId: {type: String, required: true, unique: true},
    branch: {type: String},
    year: {type: String},
    rollNumber: {type: String},
    semester : {type: String},
    fatherName : {type: String},
    hobbies : {type: Array},
    dob: {type: String},
    designation: {type: String, default: "Student"},
    
})

const updatedStudentDetail = mongoose.model('updateStudent', updatedStudentSchema);
module.exports = updatedStudentDetail;