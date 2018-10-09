'use strict';

const Joi = require('joi');
const geometryRegex = require('./regex').geometry;

module.exports = Joi.string().regex(geometryRegex);