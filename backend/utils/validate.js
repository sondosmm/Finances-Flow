const ApiError = require('./apiError');

const validate = (schema) => (req, res, next) => {
    try {
        schema.parse({
        body: req.body,
        params: req.params,
        query:req.query
    })
    next();
    }
    catch (err) {
      //if (!err.errors) return next(err); see it later
      const message = err.errors.map((e) => e.message).join(", ");
      next(new ApiError(message, 400));
    }
};
module.exports=validate