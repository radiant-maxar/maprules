'use strict';

const Joi = require('@hapi/joi');
const valuesSchema = require('./values');

const keys = {
    keyCondition: Joi.number().allow([0,1,2]),
    key: Joi.string(),
    label: Joi.string(),
    placeholder: Joi.string(),
    values: valuesSchema
};

const requiredKeys = ['key', 'keyCondition'];

module.exports = Joi
    .object()
    .keys(keys)
    .requiredKeys(requiredKeys);