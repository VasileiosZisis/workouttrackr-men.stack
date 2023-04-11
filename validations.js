const Joi = require('joi');

module.exports.logSchema = Joi.object({
  title: Joi.string().pattern(new RegExp('[a-zA-Z0-9 _-]+')).required(),
});

module.exports.exerciseSchema = Joi.object({
  title: Joi.string().pattern(new RegExp('[a-zA-Z0-9 _-]+')).required(),
});

module.exports.sessionSchema = Joi.object({
  createdDate: Joi.date().required(),
  weights: Joi.array().items(
    Joi.object({
      repetitions: Joi.number().min(0).required(),
      kilograms: Joi.number().min(0).required(),
    })
  ),
});
