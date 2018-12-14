'use strict';

const buildiDPreset = require('./preset');
const ID_DEFAULT_CATEGORIES = require('../constants').ID_DEFAULT_CATEGORIES;
const ID_GENERIC_FIELDS = require('../constants').ID_GENERIC_FIELDS;
const ID_GEOM_PRESETS = require('../constants').ID_GEOM_PRESETS;

const getiDDefaults = require('./helpers').getiDDefaults;

module.exports = (config) => {
    try {
        const iDPresets = { categories: {}, presets: {}, fields: {}, defaults: getiDDefaults() };

        iDPresets.categories = ID_DEFAULT_CATEGORIES;

        config.presets.forEach(configPreset => {
            if (configPreset.hasOwnProperty('fields')) {
                const {preset, fields} = buildiDPreset(configPreset);
                const presetName = Object.keys(preset)[0];
                iDPresets.presets = Object.assign(iDPresets.presets, preset);

                iDPresets.fields = Object.assign(iDPresets.fields, fields.reduce((field, f) => {
                    field = Object.assign(field, f);
                    return field;
                }, {}));

                preset[presetName].geometry.forEach(g => {
                    iDPresets.defaults[g.toLowerCase()].push(presetName);
                    const geomCategory = `category-${g.toLowerCase()}`;
                    iDPresets.categories[geomCategory].members.push(presetName);
                });
            }
        });

        // add geometry presets and generic fields...
        iDPresets.presets = Object.assign(iDPresets.presets, ID_GEOM_PRESETS);
        iDPresets.fields = Object.assign(iDPresets.fields, ID_GENERIC_FIELDS);
        return iDPresets;
    } catch (error) {
        throw error;
    }

};