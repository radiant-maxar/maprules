'use strict';

const adaptEqualityToConditional = require('../../../../helpers').adaptEqualityToConditional;
const escaped = require('../../../../helpers').escaped;

/**
 * Provided parameters for rule's truthiness and severity,
 * returns config used to build mapcss selector and validation error/warning
 * @param {String} key key part of selector's key, value pair
 * @param {Boolean} valCondition defines truthiness of rule when equalityValues are present
 * @param {Array} equalityValues values, that if present, define the possible values that if coupled / not coupled with key, cause an validation error/warning
 * @return {Object} config object used to build mapcss selector and validation error/warning
 */
const _alpha = (key, value) => {
    const values = value.values.map(v => `^${escaped(v.split(' - ')[0])}$`).join('|');
    const equality = value.valCondition ? '!~' : '=~';
    return [`[${key}][${key}${equality}/${values}/]`];
};

/**
 * Provided key and numericEquality object,
 * replies config used to build mapcss selector and validation error/warning
 * @param {String} key key part of the selector's key/val pair
 * @param {Object} numericEquality subset of numeric values object
 * @return {string} string component of mapcss config
 */
const _numeric = (key, value) => {
    return [adaptEqualityToConditional(key, value)];
};

module.exports = {
    numeric: _numeric,
    alpha: _alpha
};