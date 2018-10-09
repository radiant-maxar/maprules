'use strict';

const Joi = require('joi');
const osmRegex = require('./regex').osm;

module.exports = Joi.string().regex(osmRegex);