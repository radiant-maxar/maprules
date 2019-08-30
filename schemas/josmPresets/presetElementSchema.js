'use strict';

const Joi = require('@hapi/joi');
const groupElementSchema = require('./groupElementSchema');

const  keys = {
    group: groupElementSchema
};

module.exports =  Joi
    .object()
    .keys(keys)
    .requiredKeys('group');
