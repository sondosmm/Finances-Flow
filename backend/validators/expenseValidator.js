const joi = require("joi");

exports.createExpenseSchema = joi.object({
  body: joi.object({
    amount: joi.number().positive().required(),
    category: joi
      .string()
      .valid(
        "Food",
        "Transport",
        "Bills",
        "Health",
        "Entertainment",
        "Shopping",
        "Other",
      )
      .required(),
    description: joi.string().required().min(3).max(300),
    date: joi.date().optional(),
  }),
});

exports.updateExpenseSchema = joi.object({
  body: joi.object({
    amount: joi.number().positive().optional(),
    category: joi
      .string()
      .valid(
        "Food",
        "Transport",
        "Bills",
        "Health",
        "Entertainment",
        "Shopping",
        "Other",
      )
      .optional(),
    description: joi.string().optional().min(3).max(300),
    date: joi.date().optional(),
  }),
    params: joi.object({
    id:joi.string().required()
})
});
exports.deleteAndGetExpenseSchema = joi.object({
  params: joi.object({
    id: joi.string().required().length(24),
  }),
});