const mongoose = require("mongoose")

const registrationSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    programId: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// ✅ Prevent duplicate registrations for the same user + program
registrationSchema.index({ userId: 1, programId: 1 }, { unique: true });

const Registration = mongoose.model("Registration", registrationSchema);
module.exports = Registration;
