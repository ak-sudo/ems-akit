// models/Event.js
const mongoose = require("mongoose");

const ProgramSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: {
    type: String,
    enum: [
      "Athletics",
      "Cultural - Singing",
      "Cultural - Dancing",
      "Cultural - Act or play",
      "Cultural - Debate",
      "Cultural - Poetry",
      "Cultural - Speech",
      "Cultural - Playing Instruments",
      "Tech - Front-end development",
      "Tech - Back-end development",
      "Tech - Full stack development",
      "Tech - Competitive programing",
      "Tech - Prompt engineer",
      "Tech - 3d modelling",
      "Tech - Photography/videography",
      "Tech - Editing(VFX/SFX)",
      "Sport - Chess",
      "Sport - Carrom",
      "Sport - Table tennis",
      "Sport - Badminton",
      "Sport - Volleyball",
      "Sport - Cricket",
      "Esport - Clash of clans",
      "Esport - Asphalt",
      "Esport - Valorant",
      "Esport - Battleground Mobile India",
      "Esport - Free Fire",
      "Esport - IFA",
    ],
  },
});

const CoordinatorSchema = new mongoose.Schema({
  students: [{ type: Array }], // storing names instead of ObjectIds
  faculty: [{ type: Array }], // storing names instead of ObjectIds
});

const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    bannerFile: { type: String }, // store file path or URL
    description: { type: String, required: true },
    postedBy: { type: String, required: true }, // faculty name instead of ObjectId
    registrationDeadline: { type: Date, required: true },
    programs: [ProgramSchema],
    coordinators: CoordinatorSchema,
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", EventSchema);
module.exports = Event;
