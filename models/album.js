const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema({
  url: { type: String, required: true },
  type: { type: String, enum: ["image", "video"], required: true }
});

const albumSchema = new mongoose.Schema({
  name: { type: String, required: true },
  media: [mediaSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Album", albumSchema);
