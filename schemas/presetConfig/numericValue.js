'use strict';

const Joi = require('joi');

const keys = {
    key: Joi.string(),
    greaterThan: Joi.number(),
    greaterThanEqual: Joi.number(),
    lessThan: Joi.number(),
    lessThanEqual: Joi.number(),
    equal: Joi.array().items(Joi.number()),
    notEqual: Joi.array().items(Joi.number())
};

module.exports = Joi
    .object()
    .keys(keys);