const express = require("express");
const cors = require("cors");
const update = express();
const updatedStudentDetail = require("../models/updatedStudentDetails");
const updatedFacultyDetail = require("../models/updatedFacultyDetails");
const user = require("../models/user");
const { urlencoded } = require("body-parser");
// const { model } = require("mongoose");

update.use(urlencoded({ extended: true }));


update.put("/student/:id", async (req, res) => {
 const getId = req.params.id;
 req.body.connectionId = getId;

 responseRevert = await updatedStudentDetail.findOne({ connectionId: getId });
    if (responseRevert) {
        response = await updatedStudentDetail.updateOne({ connectionId: getId }, { $set: req.body });
        if (response) {
            user.findById(getId).then((userData) => {
                if (userData) {
                    userData.updatedAt = Date.now();
                    userData.save();
                    return res.status(200).send({ success: "User details updated successfully" });
                }
            });
        }
        else {
            return res.status(400).send({ err: "Error updating user details" });
        }
    }
    else{

        response = await new updatedStudentDetail(req.body).save();
        if (response) {
             user.findById(getId).then((userData) => {
                if (userData) {
                    userData.updatedAt = Date.now();
                    userData.save();
                    res.status(200).send({ success: "User details updated successfully" });
                    return;
                }
            });
         return res.status(200).send({ success: "User details updated successfully" });
        }
        else {
         return res.status(400).send({ err: "Error updating user details" });
        }
    }

});


update.put("/faculty/:id", async (req, res) => {
 const getId = req.params.id;
 req.body.connectionId = getId;

 responseRevert = await updatedFacultyDetail.findOne({ connectionId: getId });
    if (responseRevert) {
        response = await updatedFacultyDetail.updateOne({ connectionId: getId }, { $set: req.body });
        if (response) {
            user.findById(getId).then((userData) => {
                if (userData) {
                    userData.updatedAt = Date.now();
                    userData.save();
                    return res.status(200).send({ success: "User details updated successfully" });
                }
            });
        }
        else {
            return res.status(400).send({ err: "Error updating user details" });
        }
    }
    else{

        response = await new updatedFacultyDetail(req.body).save();
        if (response) {
             user.findById(getId).then((userData) => {
                if (userData) {
                    userData.updatedAt = Date.now();
                    userData.save();
                    return res.status(200).send({ success: "User details updated successfully" });
                }
            });
         return res.status(200).send({ success: "User details updated successfully" });
        }
        else {
         return res.status(400).send({ err: "Error updating user details" });
        }
    }

})

module.exports = update;
