const express = require("express");
const app = express();
const details = require("../models/updatedFacultyDetails");
const User = require("../models/user");

// Middleware to parse JSON bodies
app.use(express.json());

app.get("/all", async (req, res) => {

  try {
    const data = await User.find({role:'faculty'})
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: "❌ Server error" });
  }
});

app.delete("/:id", async(req,res)=>{
    const {id} = req.params;
    try{
        const faculty = await User.findById(id);
        if (faculty.role === 'faculty'){
            await User.findByIdAndDelete(id);
            res.status(200).json({message: "✅ User deleted sucessfully!"})
        }
        else{
            res.status(401).json({message: "❌  Only account with the role faculty can be deleted!"})
        }
    }
    catch(err){
        res.status(500).json({message: "❌ Server Error"})
    }
})

app.get("/search", async (req, res) => {
  try {
    const { phone, email } = req.query;

    let query = {};
    if (phone) query.phone = phone;
    if (email) query.email = email;

    if (Object.keys(query).length === 0) {
      return res.status(400).json({ message: "Please provide a search field" });
    }

    // Find faculty in User collection
    const faculty = await User.findOne({ ...query, role: "faculty" }).lean();

    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    // Find matching faculty details
    const facultyDetails = await details.findOne({ connectionId: faculty._id }).lean();

    // Return combined data
    const combined = {
      ...faculty,
      details: facultyDetails || null, // ensure key always exists
    };
    console.log(combined)

    res.status(200).json(combined);
  } catch (err) {
    console.error("❌ Search error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = app;

// ✅ ❌

