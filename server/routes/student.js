const express = require("express");
const app = express();
const details = require("../models/updatedStudentDetails");
const student = require("../models/user");

// Middleware to parse JSON bodies
app.use(express.json());

app.delete("/:id", async (req, res) => {
    const {id} = req.params;
  try {
    await details.deleteOne({ connectionId: id });
    await student.findByIdAndDelete(id);
    res.status(200).json({Message:"Student Deleted Successfully!"})
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = app;