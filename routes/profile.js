const express = require("express");
const cors = require("cors");
const profile = express();
const studentModel = require("../models/updatedStudentDetails");
const facultyModel = require("../models/updatedFacultyDetails");
const userModel = require("../models/user");
const eventModel = require("../models/events");

const { urlencoded } = require("body-parser");

profile.use(urlencoded({ extended: true }));



profile.get("/:role/:id", async (req, res) => {
  const { role, id } = req.params;
  if (!role || !id) {
    return res.status(400).send({ err: "Role and ID are required" });
  } else {
    try {
      data = await userModel.findById(id);

      if (data) {
        if (data.role === "student") {
          response = await studentModel.findOne({ connectionId: id });
          return res.status(200).send({ response, data });
        }
        if (data.role === "faculty") {
          response = await facultyModel.findOne({ connectionId: id });
          return res.status(200).send({ response, data });
        } else {
          return res.status(400).send({ err: "Invalid role" });
        }
      } else {
        return res.status(404).send({ err: "User not found" });
      }
    } catch (err) {
      return res.status(500).send({ err: "Server error" });
    }
  }
});

profile.get("/update/:role/:id", async (req, res) => {
  const { role, id } = req.params;
  if (!role || !id) {
    return res.status(400).send({ err: "Role and ID are required" });
  } else {
    try {
      if (role) {
        if (role === "student") {
          response = await studentModel.findOne({ connectionId: id });
          return res.status(200).send(response);
        }
        if (role === "faculty") {
          response = await facultyModel.findOne({ connectionId: id });
          return res.status(200).send(response);
        } else {
          return res.status(400).send({ err: "Invalid role" });
        }
      } else {
        return res.status(404).send({ err: "User not found" });
      }
    } catch (err) {
      return res.status(500).send({ err: "Server error" });
    }
  }
});



module.exports = profile;
