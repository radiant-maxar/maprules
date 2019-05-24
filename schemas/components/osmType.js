'use strict';

const Joi = require('@hapi/joi');
const osmTypeRegex = require('./regex').osmType;

module.exports = Joi.string().regex(osmTypeRegex);