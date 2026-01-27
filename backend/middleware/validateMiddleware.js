const ApiError = require('../utils/apiError');

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(
    {
      body: req.body,
      params: req.params,
      query: req.query,
    },
    {
      abortEarly: false,
      allowUnknown: true, // <--- 1. This stops the "params not allowed" error
      errors: {
        wrap: { label: '' }
      }
    },
  );

  if (error) {
    const message = error.details.map((d) => d.message.replace(/^(body|params|query)\./, '')).join(", ");
    next(new ApiError(message, 400));
  }
  next();
};

module.exports = validate;