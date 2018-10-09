'use strict';

const Joi = require('joi');
const fieldRegex = require('./regex').field;

module.exports =  Joi.string().regex(fieldRegex);