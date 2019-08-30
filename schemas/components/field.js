'use strict';

const Joi = require('@hapi/joi');
const fieldRegex = require('./regex').field;

module.exports =  Joi.string().regex(fieldRegex);
