'use strict';

const Joi = require('@hapi/joi');
const osmRegex = require('./regex').osm;

module.exports = Joi.string().regex(osmRegex);

