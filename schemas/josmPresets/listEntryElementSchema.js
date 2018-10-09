'use strict';

const Joi = require('joi');

const keys = {
    '@value': Joi.alternatives(Joi.number(), Joi.string()),
    '@display_value': Joi.string()
};

const requiredKeys =  ['@value', '@display_value'];

const listEntrySchema = Joi
    .object()
    .keys(keys)
    .requiredKeys(requiredKeys);

module.exports = Joi
    .array()
    .items(listEntrySchema);
    