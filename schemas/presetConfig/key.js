'use strict';

const Joi = require('@hapi/joi');

const keys = {
    key: Joi.string(),
    keyName: Joi.string(),
    length: Joi.string(),
    type: Joi.string()
};

const requiredKeys = ['key', 'keyName'];

module.exports = Joi
    .object()
    .keys(keys)
    .requiredKeys(requiredKeys);