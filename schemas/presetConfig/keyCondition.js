'use strict';

const Joi = require('joi');

module.exports = [
    Joi.string().regex(/^0$|^1$|^2$/),
    Joi.number().min(0).max(2)
];

/**
 * 0 = must not have
 * 1 = must have
 * 2 = may have
 */