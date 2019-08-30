'use strict';

const Joi = require('@hapi/joi');
const itemElementSchema = require('./itemElementSchema');

const keys = {
    '@name': Joi.string(),
    '@icon': Joi.string(),
    item: Joi.array().items(itemElementSchema)
};

const requiredKeys = ['@name','item'];

module.exports =  Joi
    .object()
    .keys(keys)
    .requiredKeys(requiredKeys);
