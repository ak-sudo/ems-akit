const express = require("express");
const admin = express();
const cors = require("cors");
const userModel = require("../models/user");
const eventModel = require("../models/events");
const studDetail = require("../models/updatedStudentDetails.js");

admin.use(express.urlencoded({ extended: true }));

admin.get("/allUsers", async (req, res) => {
  try {
    const users = await userModel.find(
      { role: { $ne: "admin" } }, // not equal to admin
      { _id: 1, name: 1, email: 1, role: 1 } // only these fields
    );
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

admin.post("/createNewEvent", async (req, res) => {
  const eventData = req.body;
  if (eventData) {
    const newEvent = new eventModel(eventData);
    await newEvent.save();
    res.status(201).json({ success: "Event created successfully" });
  } else {
    console.error(err);
    res.status(500).json({ err: "Server error" });
  }
});

admin.get("/eventList", async (req, res) => {
  try {
    const events = await eventModel.find(
      {},
      {
        id: 1,
        title: 1,
        bannerFile: 1,
        postedBy: 1,
        registrationDeadline: 1,
        bannerUrl: 1,
        description: 1,
        programs: 1,
        coordinators: 1,
      }
    );
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Server error" });
  }
});

admin.put("/update/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;
    const data = req.body;
    console.log(data);

    const update = await eventModel.findByIdAndUpdate(
      eventId,
      { $set: data },
      { new: true }
    );
    if (!update) {
      return res.status(404).json({ err: "Could not update" });
    }
    res.json({ success: "Event Updated Successfully" });
  } catch (err) {
    res.status(500).json({ err: "Server Error" });
  }
});

admin.delete("/delete/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;
    const deletedEvent = await eventModel.findByIdAndDelete(eventId);
    if (!deletedEvent) {
      return res.status(404).json({ err: "Event not found" });
    }
    res.json({ success: "Event deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

admin.get("/students", async (req, res) => {
  try {
    const { phone, email, rollNumber } = req.query;

    if (!phone && !email && !rollNumber) {
      return res
        .status(400)
        .json({ message: "Provide phone, email or rollNumber" });
    }

    // Build query dynamically
    const query = {};
    if (phone) query.phone = phone;
    if (email) query.email = email;
    if (rollNumber) query.rollNumber = rollNumber;

    if (query.rollNumber) {
      const data = await studDetail.find(query).lean();
      if (data.length === 0) {
        return res.status(404).json({
          message: `No student with roll number : ${
            Object.values(query)[0]
          } was found.`,
        });
      } else {
        const student = await userModel.findById(data[0].connectionId).lean();
        const fullDetail = { ...student, ...data[0] };

        return res.json(fullDetail);
      }
    } else {
      const student = await userModel.find(query).lean();
      if (student.length === 0) {
        return res.status(404).json({
          message: `No student with ${Object.keys(query)[0]}: ${
            Object.values(query)[0]
          } was found.`,
        });
      } else {
        const data = await studDetail
          .findOne({ connectionId: student[0]?._id })
          .lean();
        const fullDetail = { ...student[0], ...(data || {}) };

        return res.json(fullDetail);
      }
    }
  } catch (err) {
    return res.status(500).json({
      message: "Server ran into an error! Try again Later",
      error: err.message,
    });
  }
});

admin.put("/students/:studentId", async (req, res) => {
  const { studentId } = req.params;
  console.log(studentId);
});

admin.get("/faculty", async (req, res) => {
  const resp = await userModel.find({ role: "faculty" });
  if (resp) {
    res.status(200).json(resp);
  } else {
    res.status(204).json({ message: "No Faculty was found" });
  }
});

admin.put("/approve/faculty/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (status === "approved") {
    const resp = await userModel.findByIdAndUpdate(id, {
      $set: { approvedAsFaculty: true },
    });
    if (resp) {
      res.status(200).json({ message: "✅ Faculty Approved!" });
    } else {
      res
        .status(409)
        .json({ message: "❌ Faculty could not be Approved! Try again later!" });
    }
  } else if (status === "rejected") {
    const resp = await userModel.findByIdAndUpdate(id, {
      $set: { approvedAsFaculty: false },
    });
    if (resp) {
      res
        .status(200)
        .json({ message: "✅ Faculty's approval request has been refused!" });
    } else {
      res
        .status(409)
        .json({
          message:
            "❌ Faculty's approval request could not be refused! Try again later!",
        });
    }
  }
  else{
    res.status(500).json({message: "⚠️ Internal server error occurred!"})
  }
});

module.exports = admin;

// ✅ ❌⚠️