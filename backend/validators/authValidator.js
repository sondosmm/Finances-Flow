const joi = require('joi');

exports.registerSchema = joi.object({
  body: joi.object({
    name: joi.string().min(3).max(20).required(),
    email: joi.string().email().required(),
    password: joi
      .string()
      .pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-=[\]{};:'",.<>/?\\|`~])[^\s]{8,}$/,
      ).required(),
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
      .required(),
  }),
});
