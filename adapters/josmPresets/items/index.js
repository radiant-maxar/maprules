'use strict';

const mergePresets = require('../../serialize').mergePresets;

const valuesImplyCombo = require('../../helpers').valuesImplyCombo;
const flattenElements = require('../../helpers').flattenElements;

const inferJosmGeometries = require('../helpers').inferJosmGeometries;

const buildCombo = require('./combo');
const buildText = require('./text');

const AREA = require('../../constants').AREA;

const needsArea = (preset) => false;

/**
 * Provided presets, builds and replies item xml configuration for each preset field
 * @param {Object} preset preset config object
 * @return {Object} preset item xml config
 */
module.exports = (config) => {
    const presets = mergePresets(config.presets).map(preset => {
        const josmGeometries = inferJosmGeometries(preset.geometry).join(',');
        const keys = preset.primary.map(p => {
            return {
                '@key': p.key,
                '@value': p.val
            };
        });
        
        if (needsArea(preset)) {
            keys.push({
                '@key': 'area',
                '@value': 'yes'
            });
        }

        const item = {
            '@name': preset.name,
            '@type': josmGeometries,
            '@icon': 'images/layer/osmdata_small.png',
            key: keys
        };
        preset.fields.forEach(field => {
            if (Number(field.keyCondition) !== 0) {
                if (!field.values.length) {
                    item.text = (item.hasOwnProperty('text') ? item.text : []).concat(buildText(field.key, field.label));
                } else {
                    field.values.forEach(value => {
                        const uiKey = valuesImplyCombo(value) ? 'combo' : 'text';
                        const ui = uiKey === 'combo' ? buildCombo(field.key, value, field.label) : buildText(field.key, field.label);
                        const uiItem = !item.hasOwnProperty(uiKey) ? [] : item[uiKey];
                                    
                        uiItem.push(ui);
                        item[uiKey] = uiItem;
                    });
                }
            };
        });
        return item;
    });
    return flattenElements(presets);
};
