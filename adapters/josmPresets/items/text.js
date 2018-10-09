'use strict';

const asLabel = require('../../helpers').asLabel;

/**
 * Provided field, replies text input xml config object
 * @param {Object} field field xml config object
 * @return text input xml config object 
 */
module.exports = (key, label) => {
    return { 
        '@key': key,
        '@text': label || asLabel(key)
    };
};