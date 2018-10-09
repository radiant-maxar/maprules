'use strict';

/**
 * Finds all instances of must have/be fields and moves them to primary values map
 * @param {Object} presetConfig preset config file
 * @return {Object} return updated preset config
 */

exports.mergePrimaries = (config) => {
    config.presets = config.presets.map(preset => {
        const mustFields = preset.fields.filter(field => {
            return Number(field.keyCondition) === 1 
                && field.values.length 
                && field.values.every(value => value.valCondition === 1 && value.values.length === 1);
        });

        preset.primary = preset.primary.concat(mustFields.map(field => {
            return { 
                key: field.key, 
                val: field.values[0].values[0].split(' - ')[0]
            };
        }));

        preset.fields = preset.fields.filter(field => mustFields.findIndex(mustField => field.key === mustField.key) === -1);

        return preset;
    });
    return config;
};


/**
 * Sorts primaries array to make matching possible.
 * @param {Object} a primary array element
 * @param {Object} b primary array element
 */
const _primarySort = (a, b) => (a.key + a.val) < (b.key + b.val);

/**
 * Sorts fields based on their keys
 * @param {Object} a fields array element 
 * @param {Object} b fields array element 
 */
const _fieldsSort = (a, b) => a.key < b.key;

const _stringToVal = (str) => {
    return str.split('').map(char => char.charCodeAt(0)).reduce((accum, charCode) => {
        accum += charCode;
        return accum;
    }, 0);
};

/**
 * Sorts values based on valConditions & 
 * @param {Object} a values array element 
 * @param {Object} b values array element
 */
const _valuesSort = (a, b) => {
    const accum = (vals) => vals.reduce((accum, num) => { 
        accum += num; return accum; 
    }, 0);

    const aValues = accum(a.values.map(_stringToVal));
    const bValues = accum(b.values.map(_stringToVal));

    return (a.valCondition + aValues) < (b.valCondition + bValues);
};

/**
 * Given preset array, finds those with matching keys/fields/values, merges them, then returns copy
 * 
 * for example this...[
 *  { name: 'a', geom: ['area'], fields: [{ key: 'b', values: [1, 2] }] },
 *  { name: 'a', geom: ['line'], fields: [{ key: 'b', values: [1, 2] }] }
 * ]
 * ...becomes this [{ name: 'a', geom: ['area', 'line'], fields: [{ key: 'b', values: [1, 2] }] }]
 * 
 * @param {Array} presets preset array
 * @return {Array} preset array with matches merged 
 */
exports.mergePresets = (presets) => {
    return presets.reduce((merged, preset) => {
        // add first to merged...
        if (!merged.length) {
            merged.push(preset);
        } else {
            let matchingIndex;
            const matching = merged.find((m, i) => {
                if (m.name === preset.name) {
                    matchingIndex = i;
                    return true;
                } else {
                    return false;
                }
            });

            if (!matching) {
                merged.push(preset);

            } else {
                const matchingPrimaries = matching.primary.sort(_primarySort);
                const presetPrimaries = preset.primary.sort(_primarySort);

                const primaryMatch = matchingPrimaries.every((matchingPrimary, i) => {
                    const presetPrimary = presetPrimaries[i];
                    if (!presetPrimary) return false;
                    return presetPrimary.key === matchingPrimary.key && presetPrimary.val === matchingPrimary.val;
                });

                if (!primaryMatch) {
                    merged.push(preset);

                } else {
                    const matchingFields = matching.fields.sort(_fieldsSort);
                    const presetFields = preset.fields.sort(_fieldsSort);

                    const fieldsMatch = matchingFields.every((matchingField, i) => {
                        const presetField = presetFields[i];
                        if (!presetField) return false;

                        const keyMatch = presetField.key === matchingField.key && presetField.keyCondition === matchingField.keyCondition;

                        if (!keyMatch) return false;

                        const matchingFieldValues = matchingField.values.sort(_valuesSort);
                        const presetFieldValues = presetField.values.sort(_valuesSort);

                        return matchingFieldValues.every((matchingValue, i) => {
                            const presetValue = presetFieldValues[i];
                            if (!presetValue) return false;

                            return presetValue.valCondition === matchingValue.valCondition 
                                && presetValue.values.sort().join() === matchingValue.values.sort().join();
                        });
                    
                    });

                    if (!fieldsMatch) {
                        merged.push(preset);

                    } else {
                        preset.geometry.forEach(geom => {
                            if (matching.geometry.indexOf(geom) === -1) matching.geometry.push(geom);
                        });
                        merged[matchingIndex] = matching;
                    }
                }
            }
        }
        return merged;
    }, []);
};
