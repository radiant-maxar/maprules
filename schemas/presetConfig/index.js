'use strict';

const Joi = require('@hapi/joi');
const presetSchema = require('./preset');

const disabledFeatures = Joi.object({ key: Joi.string(), val: Joi.array().items(Joi.string()) });

const keys = {
    name: Joi.string(),
    presets: Joi.array().items(presetSchema),
    disabledFeatures: Joi.array().items(disabledFeatures)
};

const requiredKeys = ['name','presets'];
const optionalKeys = ['disabledFeatures'];

module.exports = Joi
    .object()
    .keys(keys)
    .requiredKeys(requiredKeys)
    .optionalKeys(optionalKeys);
