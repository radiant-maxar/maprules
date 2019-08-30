'use strict';

const Joi = require('@hapi/joi');
const configRulesSchema = require('./configRules');

module.exports = Joi.array().items(configRulesSchema);
