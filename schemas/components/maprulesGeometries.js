'use strict';

const Joi = require('@hapi/joi');
const maprulesGeometries = require('./regex').maprulesGeometries;

module.exports = Joi.string().regex(maprulesGeometries);