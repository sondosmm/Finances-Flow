const globalErrorHandler=(err,req,res,next)=>{
    err.statusCode=err.statusCode||500;
    err.status=err.status||'error'
    err.message=err.message||'something went wrong';
    res.status(err.statusCode).json({status:err.status,message:err.message,stack:err.stack});
    next();
};
module.exports={globalErrorHandler};