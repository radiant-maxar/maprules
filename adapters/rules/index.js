'use strict';

const buildRulesConfig = require('./config');
const buildMapCSS = require('./mapCSS');

/**
 * Provided a preset config, adapts/generates 
 * mapcss string reflecting rules written inside config
 * @param {Object} config presetConfig
 * @return {String} mapcss string
 */
module.exports = (config) => {
    try {
        const rulesConfig = buildRulesConfig(config);
        return buildMapCSS(rulesConfig);
    } catch (error) {
        throw error;
    }
};