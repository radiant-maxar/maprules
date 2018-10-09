'use strict';

const Joi = require('joi');
const tagSchema = require('./tag');

module.exports =  Joi
    .array()
    .items(tagSchema);