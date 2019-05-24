'use strict';

const Joi = require('@hapi/joi');
const geometryRegex = require('./regex').geometry;

module.exports = Joi.string().regex(geometryRegex);