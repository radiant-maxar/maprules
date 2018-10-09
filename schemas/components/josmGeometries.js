'use strict';

const Joi = require('joi');
const josmGeometries = require('./regex').josmGeometries;

module.exports = Joi.string().regex(josmGeometries);