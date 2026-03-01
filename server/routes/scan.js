const express = require("express");
const scan = express();
const User = require("../models/user");
const updatedUser = require("../models/updatedStudentDetails");
const eventAttendance = require("../models/EventAttendance");


scan.get("/user/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ err: "User does not exist!" });
  }

  try {
    const userData = await User.findById(id);
    const updatedUserData = await updatedUser.findOne({ connectionId: id });

    const exist = await eventAttendance.findOne({ studentId: id, outTime: null });

    if (exist) {
      await eventAttendance.findByIdAndUpdate(
        exist._id,
        { outTime: Date.now() }
      );
    } else {
      await eventAttendance.create({ studentId: id, connectionId: id,});
    }

    return res.json({
      name: userData.name,
      designation: userData.role,
      email: userData.email,
      phone: userData.phone,
      branch: updatedUserData?.branch,
      year: updatedUserData?.year,
      roll: updatedUserData?.rollNumber,
      dob: updatedUserData?.dob,
      father: updatedUserData?.fatherName,
      photo: userData.dpurl,
      msg: (exist)?true:false},
    );

  } catch (err) {
    console.log(err);
    return res.status(400).json({ err: "Something went wrong!" });
  }
});

module.exports = scan;
