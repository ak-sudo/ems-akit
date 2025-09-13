const express = require('express');
const cors = require('cors');
const auth = express();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

auth.post('/signup', async (req,res)=>{
    const details = req.body;

    let hashedPassword = await bcrypt.hash(details.password, 10);
    details.password = hashedPassword;

    const user = new User(details);
    savedUser = await user.save();
    if (savedUser){
        return res.status(200).send({success: 'User signed up successfully'});
    }
    else{

        return res.status(400).send({err: 'Error signing up user'});
    }
})


auth.post('/login', async(req,res)=>{
    const details = req.body;

    getUser = await User.findOne({email: details.email})

    if (getUser){
        matchHatchPwd = await bcrypt.compare(details.password, getUser.password);

        if (matchHatchPwd){
            const isApproved = getUser.approvedAsFaculty;

            if (getUser.role === 'faculty' && isApproved){
                const token = jwt.sign({id: getUser._id, email: getUser.email, role: getUser.role, dp: getUser.dpurl, approved: isApproved}, process.env.JWT_SECRET, {expiresIn: '1h'});
                return res.status(200).json({msg: 'User logged in successfully', token: token, id: getUser._id, role: getUser.role});
            }
            else{
                const token = jwt.sign({id: getUser._id, email: getUser.email, role: getUser.role, dp: getUser.dpurl, approved:isApproved}, process.env.JWT_SECRET, {expiresIn: '1h'});
                return res.status(401).json({msg: 'Approval by admin is still pending! Once approved you will be logged in', token: token, id: getUser._id, role: getUser.role});               
            }
        }       
        else{
            return res.status(400).send({err: '❌ Incorrect password entered! Please try again.'});
        }
    }
    else{
        res.status(400).send({err: '⚠️ Account with this email does not exist! Please sign up.'});
    }
})

module.exports = auth;
