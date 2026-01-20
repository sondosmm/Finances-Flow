const jwt = require('jsonwebtoken');

const generateToken = (userId)=>{
    const accessToken = jwt.sign({id:userId},process.env.JWT_ACCESS_SECRET,{expiresIn:"60m"});
    return accessToken
};


module.exports=generateToken;