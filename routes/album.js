const express = require("express");
const app = express();
const Album = require("../models/album");

// Middleware to parse JSON bodies
app.use(express.json());


app.get("/all", async (req, res) => {
  try {
    const albums = await Album.find().sort({ createdAt: -1 });
    res.json(albums);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Optional: GET single album by ID (if needed)
app.get("/:id", async (req, res) => {

  try {
    const album = await Album.findById(req.params.id);
    if (!album) return res.status(404).json({ error: "Album not found" });
    res.json(album);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = app;