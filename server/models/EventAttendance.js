const mongoose = require("mongoose");

const eventAttendanceSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  connectionId :{
    type: String,
    ref: "updatestudent",
  },
  inTime: { type: Date, default: Date.now },
  outTime: { type: Date, default: null},
  month: {type:String, default: () =>
    new Date().toLocaleString("default", { month: "long" })},
  session: {type:String, default: () => new Date().getFullYear().toString()}
});

const eventAttendance = new mongoose.model(
  "EventAttendance",
  eventAttendanceSchema,
);
module.exports = eventAttendance;
