'use strict';
const Joi = require('@hapi/joi');

const keyElementSchema = require('./keyElementSchema');
const comboElementSchema = require('./comboElementSchema');
const textElementSchema = require('./textElementSchema');
const josmGeometries = require('../components').josmGeometries;

const keys = {
    '@name': Joi.string(),
    '@type': josmGeometries,
    '@icon': Joi.string(),
    'combo': Joi.array().items(comboElementSchema),
    'text': Joi.array().items(textElementSchema),
    'key': Joi.array().items(keyElementSchema)
};

const requiredKeys = ['@name','@type'];
const optionalKeys = ['combo','text','key','@icon'];

module.exports = Joi
    .object()
    .keys(keys)
    .requiredKeys(requiredKeys)
    .optionalKeys(optionalKeys);
