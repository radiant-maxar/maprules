'use strict';

const Joi = require('joi');
const configRulesSchema = require('./configRules');

module.exports = Joi.array().items(configRulesSchema);
