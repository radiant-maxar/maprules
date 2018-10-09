'use strict';

const Joi = require('joi');
const resourceRegex = require('./regex').resource;

module.exports = Joi.string().regex(resourceRegex);