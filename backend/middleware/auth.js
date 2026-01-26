const jwt = require ('jsonwebtoken');
const dotenv=require ('dotenv');
const ApiError = require('../utils/apiError');
dotenv.config({path:"../.env"});

const auth =(req,res,next)=>{
    const accessToken = req.cookies.accessToken;
    if (!accessToken)
      return next(new ApiError("No Token Provided", 401));
    try {
        const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
        req.user=decoded;
        next();
    }
    catch(err){
        next (new ApiError('Invalid access',401));
    }
};

module.exports=auth;