'use strict';

const Joi = require('joi');
const osmTypeRegex = require('./regex').osmType;

module.exports = Joi.string().regex(osmTypeRegex);