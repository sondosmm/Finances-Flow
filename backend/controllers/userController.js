const User= require('../models/userModel');
const ApiError=require('../utils/apiError');
const asyncHandler = require("express-async-handler");


exports.getUserInfo=asyncHandler(async(req,res,next)=>{
    const user = await User.findById(req.user.id);
    if (!user) {
        return next(new ApiError("User not found", 404));
    }
    res.status(200).json({data:user});
});

exports.updateUserInfo=asyncHandler(async(req,res,next)=>{
    const {name,budget}=req.body;
    //if i used the update method it will be a bit diff i will pass the updates and also new :true and run validation:true
    //with no need to use user.save the updates will be automatically saved
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new ApiError("User not found", 404));
    }
    if (name!==undefined)
        user.name=name;
    if (budget !== undefined)
        user.budget = budget;
    await user.save();
   res.status(200).json({message:'user updated successfully',data:user});
});


