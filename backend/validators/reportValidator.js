const joi = require("joi");


exports.monthlyReportSchema = joi.object({
  query: joi.object({
    month: joi.number().required().min(1).max(12),
    year: joi.number().required().min(2020),
  }),
});