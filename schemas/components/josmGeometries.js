'use strict';

const Joi = require('@hapi/joi');
const josmGeometries = require('./regex').josmGeometries;

module.exports = Joi.string().regex(josmGeometries);
