const jwt = require('jsonwebtoken');

const generateToken = (userId)=>{
    const accessToken = jwt.sign(process.env.JWT_ACCESS_SECRET,{expiresIn:"15m"});
    return accessToken
};


module.exports=generateToken;