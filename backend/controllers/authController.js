const User =require ('../models/userModel');
const ApiError = require('../utils/apiError');
const asyncHandler =require('express-async-handler');
const bcrypt= require('bcryptjs');
const generateToken=require('../utils/generateToken')
exports.register=asyncHandler(async(req,res,next)=>{
    const {name, email,password}=req.body;
    const user=await User.create({name,email,password});
    res.status(201).json({message:'user registered successfully',id:user._id});
});

exports.login=asyncHandler(async(req,res,next)=>{
    const {email,password}=req.body;
    const user =await User.findOne({email}).select('+password');
    if (!user ||!(await bcrypt.compare(password,user.password))){
        return next(new ApiError('incorrect email or password',401));
    }
    const accessToken = generateToken(user._id);
    res.cookie("accessToken", accessToken, { httpOnly: true, sameSite: "strict" });
    res.status(200).json({message:'user logged in successfully'});
});

exports.logout=asyncHandler(async(req,res,next)=>{
    res.clearCookie("accessToken", { httpOnly: true, sameSite: "strict" });
    res.status(200).json({message:'user logged out successfully'});
});