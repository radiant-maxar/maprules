'use strict';

const Joi = require('joi');
const uuid = require('../components').uuid;

/**
 * list of abstracted preset config files for exploring presets...
 */
module.exports = Joi.object().keys({
    id: uuid,
    name: Joi.string(),
    presets: Joi.array().items(Joi.string())
});