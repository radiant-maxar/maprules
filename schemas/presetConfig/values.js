'use strict';

const Joi = require('joi');

const keys = {
    valCondition: Joi.number().min(0).max(6),
    values: Joi.array().items(Joi.string()),
    suggestedValues: Joi.array().items(Joi.string())
};

const requiredKeys = ['valCondition', 'values'];
const optionalKeys = ['suggestedValues'];

const valueSchema = Joi
    .object()
    .keys(keys)
    .requiredKeys(requiredKeys)
    .optionalKeys(optionalKeys);

module.exports = Joi
    .array()
    .items(valueSchema);

/**
 * 0 = must not be
 * 1 = must be
 * 2 = may be
 * 3 = less than
 * 4 = less than or equal to
 * 5 = greater than
 * 6 = greater than or equal to
 */