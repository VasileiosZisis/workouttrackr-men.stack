const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
  type: 'string',
  base: joi.string(),
  messages: {
    'string.escapeHTML': '{{#label}} must not include HTML!',
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error('string.escapeHTML', { value });
        return clean;
      },
    },
  },
});

const Joi = BaseJoi.extend(extension);

module.exports.LogSchema = Joi.object({
  title: Joi.string()
    .alphanum()
    .pattern(new RegExp('[a-zA-Z0-9 _-]+'))
    .escapeHTML()
    .required(),
});

module.exports.exerciseSchema = Joi.object({
  title: Joi.string()
    .alphanum()
    .pattern(new RegExp('[a-zA-Z0-9 _-]+'))
    .escapeHTML()
    .required(),
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
