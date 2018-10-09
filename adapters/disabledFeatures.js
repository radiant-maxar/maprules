'use strict';

const THROW_ERROR = require('./constants').THROW_ERROR;
const flattenElements = require('./helpers').flattenElements;
const escaped = require('./helpers').escaped;

/**
 * Provided list of disabled features, adapts appropriate MapCSS rules config
 * @param {Array} disabledFeatures array of disabled features
 * @return {Array} array of adpated MapCSS rules
 */
module.exports = (disabledFeatures, osmType) => {
    return flattenElements(disabledFeatures).map(feature => {
        const base = `[${feature.key}]`;

        let rule;

        if (!feature.val.length) {
            rule = {
                base: base,
                fieldConditionals: [],
                toThrow: THROW_ERROR,
                message: `The key '${feature.key}' is not allowed.`
            };
        } else if (feature.val.length === 1) {
            rule = {
                base: base,
                fieldConditionals: [`[${feature.key}=${feature.val[0]}]`],
                toThrow: THROW_ERROR,
                message: `'${feature.key}' cannot be coupled with '${feature.val[0]}'`
            };
        } else {
            const regex = feature.val.map(v => `^${escaped(v.split(' - ')[0])}$`).join('|');
            rule = {
                base: base,
                fieldConditionals: [`[${feature.key}=~/${regex}/]`],
                toThrow: THROW_ERROR,
                message: `${feature.key} cannot be coupled with ${feature.val.map(v => `'${v}'`).join(',')}`
            };
        }

        return {
            osmType: osmType,
            rules: [rule]
        };
    });
};
