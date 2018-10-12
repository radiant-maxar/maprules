'use strict';

const buildRule = require('./rule');
const flattenElements = require('../../helpers').flattenElements;

/**
 * Provided mapcss config, replies mapcss string
 * @param {Object} config the mapcss config
 * @return {String} mapcss string
 */
module.exports = (config) => {
    return flattenElements(config.map((configRule) => {
        return configRule.rules.map((tagCheck) => {
            return buildRule(tagCheck, configRule.osmType);
        });
    })).join('');
};
