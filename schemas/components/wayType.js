'use strict';

const Joi = require('joi');
const wayTypeRegex = require('./regex').wayType;

module.exports = Joi.string().regex(wayTypeRegex);