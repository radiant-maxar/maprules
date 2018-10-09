'use strict';

const asLabel = require('../../helpers').asLabel;

/**
 * Provided field config object, replies combobox xml object
 * @param {Object} field field object
 * @return {Object} Combobox xml config object
 */
module.exports = (key, value, label) => {
    return {
        '@key': key,
        '@text': label || key,
        '@values_searchable': true,
        list_entry: value.values.map(v => {
            const [value, displayValue] = v.split(' - ');
            return {
                '@value': value,
                '@display_value': asLabel(displayValue || value)
            };
        })
    };
};