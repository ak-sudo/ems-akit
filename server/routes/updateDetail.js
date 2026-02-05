const express = require("express");
const cors = require("cors");
const update = express();
const updatedStudentDetail = require("../models/updatedStudentDetails");
const updatedFacultyDetail = require("../models/updatedFacultyDetails");
const user = require("../models/user");
const { urlencoded } = require("body-parser");
const QRcode = require("qrcode");
const { DestinationAlphaSenderPage } = require("twilio/lib/rest/messaging/v1/service/destinationAlphaSender");
// const { model } = require("mongoose");

update.use(urlencoded({ extended: true }));


// update.put("/student/:id", async (req, res) => {
//  const getId = req.params.id;
//  req.body.connectionId = getId;

//  responseRevert = await updatedStudentDetail.findOne({ connectionId: getId });
//     if (responseRevert) {
//         response = await updatedStudentDetail.updateOne({ connectionId: getId }, { $set: req.body });
//         if (response) {
//             user.findById(getId).then(async (userData) => {
//                 if (userData) {
//                     userData.updatedAt = Date.now();
//                     try {
//                         const studentData = req.body;

//                         // 1. Save student
//                         const student = await Student.create(studentData);

//                         // 2. Convert student data → QR
//                         const qrPayload = {
//                         id: student._id,
//                         name: student.name,
//                         email: student.email,
//                         phone: student.phone,
//                         branch: student.branch,
//                         rollNumber: student.rollNumber
//                         };

//                         const qrString = JSON.stringify(qrPayload);

//                         const qrImage = await QRCode.toDataURL(qrString);

//                         // 3. Save QR code into DB
//                         student.qrCode = qrImage;
//                         await student.save();

//                         res.status(201).json(student);
//                     } catch (err) {
//                         res.status(500).json({ message: "Error creating student" });
//                     }
//                     userData.save();
//                     return res.status(200).send({ success: "User details updated successfully" });
//                 }
//             });
//         }
//         else {
//             return res.status(400).send({ err: "Error updating user details" });
//         }
//     }
//     else{

//         response = await new updatedStudentDetail(req.body).save();
//         if (response) {
//              user.findById(getId).then((userData) => {
//                 if (userData) {
//                     userData.updatedAt = Date.now();
//                     userData.save();
//                     res.status(200).send({ success: "User details updated successfully" });
//                     return;
//                 }
//             });
//          return res.status(200).send({ success: "User details updated successfully" });
//         }
//         else {
//          return res.status(400).send({ err: "Error updating user details" });
//         }
//     }

// });

update.put("/student/:id", async (req, res) => {
  try {
    const studentId = req.params.id;
    req.body.connectionId = studentId;

    // 1. Update or Create updatedStudentDetails
    const existingDetails = await updatedStudentDetail.findOne({ connectionId: studentId });

    if (existingDetails) {
      await updatedStudentDetail.updateOne(
        { connectionId: studentId },
        { $set: req.body }
      );
    } else {
      await new updatedStudentDetail(req.body).save();
    }

    // 2. Fetch main user record
    const userData = await user.findById(studentId);

    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }

    // 3. Generate QR Payload
    const qrPayload = {
      id: userData._id,
    };

    const qrString = JSON.stringify(qrPayload);

    // 4. Generate Base64 QR
    const qrCodeImage = await QRcode.toDataURL(qrString);

    // 5. Save QR inside main user model
    userData.qrCode = qrCodeImage;
    userData.updatedAt = Date.now();
    await userData.save();

    return res.status(200).json({
      message: "Profile updated & QR generated successfully",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Something went wrong while updating profile & generating QR"
    });
  }
});


update.put("/faculty/:id", async (req, res) => {
  try {
    const facultyId = req.params.id;
    req.body.connectionId = facultyId;

    // 1. Update or Create updatedFacultyDetails
    const existingDetails = await updatedFacultyDetail.findOne({ connectionId: facultyId });

    if (existingDetails) {
      await updatedFacultyDetail.updateOne(
        { connectionId: facultyId },
        { $set: req.body }
      );
    } else {
      await new updatedFacultyDetail(req.body).save();
    }

    // 2. Fetch main user record
    const userData = await user.findById(facultyId);

    if (!userData) {
      return res.status(404).json({ error: "Faculty user not found" });
    }

    // 3. Create QR payload
    const qrPayload = {
      id: userData._id,
    };

    const qrString = JSON.stringify(qrPayload);

    // 4. Generate QR code
    const qrCodeImage = await QRcode.toDataURL(qrString);

    // 5. Save QR inside user model
    userData.qrCode = qrCodeImage;
    userData.updatedAt = Date.now();
    await userData.save();

    return res.status(200).json({
      message: "Faculty profile updated & QR generated successfully",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Something went wrong while updating faculty profile & generating QR"
    });
  }
});


module.exports = update;
