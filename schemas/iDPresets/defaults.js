'use strict';

const Joi = require('joi');

const keys = {
    area: Joi.array().items(Joi.string()),
    line: Joi.array().items(Joi.string()),
    point: Joi.array().items(Joi.string()),
    relation: Joi.array().items(Joi.string()),
    vertex: Joi.array().items(Joi.string())
};

const optionalKeys = ['area', 'line', 'point', 'relation', 'vertex'];

module.exports = Joi
    .object()
    .keys(keys)
    .optionalKeys(optionalKeys);