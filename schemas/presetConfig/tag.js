'use strict';

const Joi = require('joi');

module.exports = Joi
    .object()
    .keys({
        key: Joi.string(),
        val: Joi.string()
    });