'use strict';

const Joi = require('@hapi/joi');
const fieldSchema = require('./field');
const maprulesGeometries = require('../components').maprulesGeometries;
const tagListSchema = require('./tagList');

const keys = {
    fields: Joi.array().items(fieldSchema.optional()),
    geometry: Joi.array().items(maprulesGeometries),
    name: Joi.string(),
    primary: tagListSchema 
};

const requiredKeys = ['primary', 'geometry', 'name', 'fields'];

module.exports = Joi
    .object()
    .keys(keys)
    .requiredKeys(requiredKeys);
