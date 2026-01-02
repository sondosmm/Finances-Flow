const jwt = require ('jsonwebtoken');
const dotenv=require ('dotenv');
const ApiError = require('../utils/apiError');
dotenv.config({path:"../.env"});

const auth =(req,res,next)=>{
    const authHeader=req.header.authorization;
    if (!authHeader||authHeader.stratsWith('Bearer '))
        return next(new ApiError("No Token Provided",401));
    try {
        token=authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        req.userId=decoded.id;
        next();
    }
    catch(err){
        next (new ApiError('Invalid access'),401);
    }
};

module.exports=auth;