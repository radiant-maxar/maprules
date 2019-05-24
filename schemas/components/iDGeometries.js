'use strict';

const Joi = require('@hapi/joi');
const iDGeometries = require('./regex').iDGeometries;

module.exports = Joi.string().regex(iDGeometries);