'use strict';

const Joi = require('joi');

const iDGeometries = require('../components').iDGeometries;

const keys = {
    geometry: Joi.array().items(iDGeometries),
    icon: Joi.string(),
    tags: Joi.object(),
    name: Joi.string(),
    matchScore: Joi.number(),
    fields: Joi.array().items(Joi.string())
};

const requiredKeys = ['geometry', 'tags', 'name'];
const optionalKeys = ['matchScore', 'icon', 'fields'];

module.exports = Joi
    .object()
    .keys(keys)
    .requiredKeys(requiredKeys)
    .optionalKeys(optionalKeys);