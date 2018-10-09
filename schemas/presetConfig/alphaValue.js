'use strict';

const Joi = require('joi');
const requiredKeys = ['val'];

module.exports = Joi
    .object()
    .keys({
        val: Joi.string(),
        name: Joi.string()  
    })
    .requiredKeys(requiredKeys); 