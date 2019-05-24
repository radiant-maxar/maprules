'use strict';

const Joi = require('@hapi/joi');

const keys = {
    '@key': Joi.string(),
    '@text': Joi.string(),
    '@length': Joi.number().positive()
};

const requiredKeys = ['@key', '@text'];

module.exports = Joi
    .object()
    .keys(keys)
    .requiredKeys(requiredKeys);