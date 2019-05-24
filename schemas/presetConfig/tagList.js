'use strict';

const Joi = require('@hapi/joi');
const tagSchema = require('./tag');

module.exports =  Joi
    .array()
    .items(tagSchema);