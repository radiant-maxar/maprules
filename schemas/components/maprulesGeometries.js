'use strict';

const Joi = require('joi');
const maprulesGeometries = require('./regex').maprulesGeometries;

module.exports = Joi.string().regex(maprulesGeometries);