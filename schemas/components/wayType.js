'use strict';

const Joi = require('@hapi/joi');
const wayTypeRegex = require('./regex').wayType;

module.exports = Joi.string().regex(wayTypeRegex);

