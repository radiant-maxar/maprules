'use strict';

const Joi = require('joi');

const multipleAlternatives = [
    Joi.string().regex(/^\[([A-Z0-9]{3}|[A-Z0-9]{4,5}_[A-Z0-9]{3,4})\]\[([A-Z0-9]{3}|[A-Z0-9]{4,5}_[A-Z0-9]{3,4})(=~|!~)\/([A-Za-z0-9]*\|?)*\/\]$/),
    Joi.string().regex(/^\[([A-Z0-9]{3}|[A-Z0-9]{4,5}_[A-Z0-9]{3,4})\]\[([A-Z0-9]{3}|[A-Z0-9]{4,5}_[A-Z0-9]{3,4})(=~|!~)\/([A-Za-z0-9]*\|?)*\/\]$/)
];

module.exports = multipleAlternatives;
