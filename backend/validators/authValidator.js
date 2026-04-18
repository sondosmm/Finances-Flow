const joi = require('joi');

exports.registerSchema = joi.object({
  body: joi.object({
    name: joi.string().min(3).max(20).required(),
    email: joi.string().email().required(),
    password: joi
      .string()
      .pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-=[\]{};:'",.<>/?\\|`~])[^\s]{8,}$/,
      )
      .required()
      .message({
        "string.pattern.name":
          "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",
      }),
  }),
});


exports.loginSchema = joi.object({
  body: joi.object({
    email: joi.string().email().required(),
    password: joi
      .string()
      .pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-=[\]{};:'",.<>/?\\|`~])[^\s]{8,}$/,
      )
      .required()
      .message({
        "string.pattern.name":
          "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",
      }),
  }),
});
