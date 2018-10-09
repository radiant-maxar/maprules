'use strict';

const Joi = require('joi');

const keys = {
    key: Joi.string(),
    label: Joi.string(),
    overrideLabel: Joi.string(),
    type: Joi.string(),
    placeholder: Joi.string(),
    icon: Joi.string(),
    options: Joi.array().items(Joi.string()),
    strings: Joi.object(),
    snake_case: Joi.boolean(),
    caseSensitive: Joi.boolean(),
    universal: Joi.boolean(),
    minValue: Joi.number(),
    maxValue: Joi.number()
};

const requiredKeys = ['type', 'key', 'label'];
const optionalKeys = [
    'overrideLabel',
    'options',
    'strings', 
    'icon',
    'minValue', 
    'maxValue', 
    'placeholder',
    'caseSensitive', 
    'snake_case', 
    'universal'
];

module.exports = Joi
    .object()
    .keys(keys)
    .requiredKeys(requiredKeys)
    .optionalKeys(optionalKeys);
