'use strict';

const Joi = require('@hapi/joi');
const singleFieldConditionalSchema = require('./single');
const multipleFieldConditionalSchema = require('./multiple');

module.exports = Joi
    .array()
    .items([singleFieldConditionalSchema,multipleFieldConditionalSchema]);