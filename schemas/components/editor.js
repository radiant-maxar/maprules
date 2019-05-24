'use strict';

const Joi = require('@hapi/joi');
const editorRegex = require('./regex').editor;

module.exports = Joi.string().regex(editorRegex);