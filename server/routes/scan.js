const express = require("express");
const scan = express();
const User = require("../models/user");
const updatedUser = require('../models/updatedStudentDetails')

scan.get("/user/:id", async (req, res) => {
  const { id } = req.params;

  if (id) {
    try {
      const userData = await User.findById(id);
      const updatedUserData = await updatedUser.findOne({connectionId: id})

      return res.json({
        name:  userData.name,
        designation:  userData.role,
        email:  userData.email,
        phone:  userData.phone,
        branch:  updatedUserData.branch,
        year:  updatedUserData.year,
        roll:  updatedUserData.rollNumber,
        dob:  updatedUserData.dob,
        father: updatedUserData.fatherName,
        photo: userData.dpurl,
      });
    } catch {
        return res.status(400).json({err: 'Something went wrong!'})
    }
  } else {
    return res.status(400).json({err: "User does not exist!"})
  }
});

module.exports = scan;
