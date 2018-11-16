'use strict';

const NODE = require('../../constants').NODE;
const WAY = require('../../constants').WAY;

const buildTagChecks = require('./tagChecks');
const buildDisabledFeatureChecks = require('../../disabledFeatures');

const flattenElements = require('../../helpers').flattenElements;
const inferJosmGeometries = require('../../josmPresets/helpers').inferJosmGeometries;

/**
 * Provided presetConfig, replies rules used to build MapCSS
 * replies a single mapcss rule config.
 * @param {Object} config presetConfig
 * @return {Object} single mapcss rule config.
 */
module.exports = (config) => {
    const configRules = config.presets.map((preset) => {
        const rules = preset.fields.map((field) => {
            return buildTagChecks(field, preset.primary, preset.name, config.name);
        });

        return inferJosmGeometries(preset.geometry).map((geometry) => {
            return {
                osmType: geometry,
                rules: flattenElements(rules)
            };
        });
    });

    if (config.hasOwnProperty('disabledFeatures')) {
        const disabledFeatures = [NODE, WAY].map((geom) => {
            return buildDisabledFeatureChecks(config.disabledFeatures, geom, config.name);
        });
        configRules.concat(disabledFeatures);
    }

    return flattenElements(configRules);
};