'use strict';

const Joi = require('joi');
const iDGeometries = require('./regex').iDGeometries;

module.exports = Joi.string().regex(iDGeometries);