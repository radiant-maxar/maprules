'use strict';

const Joi = require('joi');
const editorRegex = require('./regex').editor;

module.exports = Joi.string().regex(editorRegex);