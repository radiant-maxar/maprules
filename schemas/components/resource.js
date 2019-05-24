'use strict';

const Joi = require('@hapi/joi');
const resourceRegex = require('./regex').resource;

module.exports = Joi.string().regex(resourceRegex);