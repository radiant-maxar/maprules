'use strict';

const Joi = require('joi');

const categoriesSchema = require('./categories');
const defaultsSchema = require('./defaults');
const fieldSchema = require('./field');
const presetSchema = require('./preset');

const iDCategories = require('../components/regex').iDCategories;

const keys = {
    categories: Joi.object().pattern(iDCategories, categoriesSchema), 
    defaults: defaultsSchema,
    fields: Joi.object().pattern(/[a-z_]*/i, fieldSchema),
    presets: Joi.object().pattern(/[a-z_]*/i, presetSchema)
};

const requiredKeys = ['defaults', 'fields', 'presets'];

module.exports = Joi
    .object()
    .keys(keys)
    .requiredKeys(requiredKeys);