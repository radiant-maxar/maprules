'use strict';

const Joi = require('joi');
const tagChecksSchema = require('./tagChecks');
const josmGeometries = require('../components').josmGeometries;
const wayType = require('../components').wayType;

const keys = {
    osmType: josmGeometries,
    rules: Joi.array().items(tagChecksSchema),
    wayType: wayType
};

const requiredKeys = ['osmType','rules'];

module.exports = Joi
    .object()
    .keys(keys)
    .requiredKeys(requiredKeys);

/**
 * Potenial Rule Combinations
 * 
 * keyCondition = 1 && no specified values:
 * - [base][!fieldKey]
 * 
 * keyCondition = 1 && 1 specified values
 * - [base][fieldKey!=value]
 * - [base][!fieldKey]
 * 
 * keyCondition = 1 && > 1 specified value
 * - [base][fieldKey!~/a|b/]
 * - [base][!fieldKey]
 * 
 * keyCondition = 0 && no specified values
 * - [base][fieldKey]
 * 
 * keyCondition = 0 && 1 specified value
 * - [base][fieldKey=value]
 * 
 * keyCondition = 0 && > 1 specified value
 * - [base][fieldKey=~/a|b/]
 * 
 */