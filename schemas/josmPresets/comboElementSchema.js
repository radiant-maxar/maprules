'use strict';

const Joi = require('@hapi/joi');
const listEntryElementSchema = require('./listEntryElementSchema');

const keys = {
    '@key': Joi.string(),
    '@text': Joi.string(),
    '@values_searchable': Joi.boolean(),
    list_entry: listEntryElementSchema
};

const requiredKeys = ['@key','@text','@values_searchable','list_entry'];

module.exports = Joi
    .object()
    .keys(keys)
    .requiredKeys(requiredKeys);
