'use strict';

const Joi = require('@hapi/joi');

const keys = {
    geometry: Joi.string(),
    icon: Joi.string(),
    members: Joi.array().items(Joi.string()),
    name: Joi.string()
};

const requiredKeys = ['geometry', 'icon', 'members', 'name'];

module.exports = Joi
    .object()
    .keys(keys)
    .requiredKeys(requiredKeys);