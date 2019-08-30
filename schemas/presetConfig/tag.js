'use strict';

const Joi = require('@hapi/joi');

module.exports = Joi
    .object()
    .keys({
        key: Joi.string(),
        val: Joi.string()
    });