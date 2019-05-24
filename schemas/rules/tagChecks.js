'use strict';

const Joi = require('@hapi/joi');
const tagChecksSchema = require('./tagChecks');

const baseMapCSSRuleSchema = require('./baseMapCSSRule');
const fieldConditionalsSchema = require('./fieldConditionals');

const keys = {
    base: baseMapCSSRuleSchema,
    fieldConditionals: fieldConditionalsSchema,
    toThrow: Joi.string().regex(/^throwWarning$|^throwError$/),
    message: Joi.string() 
};

const requiredKeys = ['base','toThrow','message'];

module.exports = Joi
    .object()
    .keys(keys)
    .requiredKeys(requiredKeys);

