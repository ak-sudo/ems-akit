const express = require("express");
const cors = require("cors");
const register = express();
const eventModel = require("../models/events");
const Registration = require("../models/registration");
const studDetail = require("../models/updatedStudentDetails.js")

const { exportToPDF, exportToCSV } = require("../utils/exportUtils.js");

function mergeRegistrationsWithRoll(details, registrations) {
  // build a map for fast lookup
  const rollMap = {};
  Object.keys(details).forEach((key) => {
    if (!isNaN(key)) {
      const item = details[key];
      rollMap[item.connectionId] = item.rollNumber;
    }
  });

  // attach rollNumber to each registration
  const merged = registrations.map((reg) => {
    const userId = reg.userId?._id?.toString();
    return {
      ...reg.toObject(), // if it's a mongoose doc
      rollNumber: rollMap[userId] || "N/A",
    };
    
  });

  return merged;
}

register.use(express.json());
register.use(express.urlencoded({ extended: true }));

register.get("/events/:eventId", async (req, res) => {
  const { eventId } = req.params;
  let resp = await eventModel.findById(eventId);
  if (resp) {
    return res.status(200).json({ data: resp });
  } else {
    console.log("Error occurred");
  }
});

register.get("/event/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;

    const registrations = await Registration.find({ eventId })
      .populate("userId") // fetch user details
      .populate("eventId") // fetch event details

    const details = await studDetail.find();

    res.status(200).json({registrations,details});
  } catch (err) {
    console.error("Fetch registrations error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

register.get("/export/:type/:eventId", async(req,res)=>{
try {
    const { type, eventId } = req.params;
    const { programId } = req.query;

    // ✅ Apply program filter if provided
    const filter = { eventId };
    if (programId) filter.programId = programId;

    const details = await studDetail.find({}, { rollNumber: 1, connectionId: 1, _id: 0 });

    let registrations = await Registration.find(filter)
      .populate("userId")
      .populate("eventId");

    const fullData = mergeRegistrationsWithRoll(details,registrations)

    console.log(fullData)

    if (!registrations.length) {
      return res.status(404).json({ message: "No registrations found" });
    }

    // ✅ Prepare clean rows (only UI fields)
    const data = fullData.map((r) => ({
      Name: r.userId?.name || "N/A",
      Email: r.userId?.email || "N/A",
      Phone: r.userId?.phone || "N/A",
      "Roll No.": r.rollNumber || "N/A",
      Program:
        r.eventId?.programs?.find((p) => p._id.toString() === r.programId)
          ?.title || "N/A",
      Event: r.eventId?.title || "N/A",
      "Registered At": new Date(r.registeredAt).toLocaleString(),
    }));

    if (type === "csv") {
      return exportToCSV(res, data, "registrations.csv"); // ✅ send clean data
    } else if (type === "pdf") {
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=registrations.pdf`
      );
      res.setHeader("Content-Type", "application/pdf");
      exportToPDF("registrations.pdf", data, res); // ✅ pass clean data here
    } else {
      return res.status(400).json({ message: "Invalid export type" });
    }
  } catch (err) {
    console.error("Export error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

register.post("/register", async (req, res) => {
  try {
    const { eventId, programId, userId } = req.body;

    if (!eventId || !programId || !userId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if already registered
    const existing = await Registration.findOne({ userId, programId });

    if (existing) {
      return res
        .status(409)
        .json({ message: "Already registered for this program" });
    }

    // Create new registration
    const registration = new Registration({
      eventId,
      programId,
      userId,
    });

    await registration.save();

    res.status(201).json({
      message: "✅ Registered successfully",
      registration,
    });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = register;


