const joi = require('joi');

exports.updateUserSchema = joi.object({
    body: joi.object({
        name: joi.string().min(3).max(20).optional(),
        budget: joi.number().min(0).optional()
    })
});