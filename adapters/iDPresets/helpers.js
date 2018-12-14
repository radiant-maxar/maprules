'use strict';

const asLabel = require('../helpers').asLabel;

const ID_DEFAULTS = require('../constants').ID_DEFAULTS;
const isArea = require('id-area-keys').isArea;

const WAY = require('../constants').WAY;
const CLOSEDWAY = require('../constants').CLOSEDWAY;

const POINT = require('../constants').POINT;
const LINE = require('../constants').LINE;
const AREA = require('../constants').AREA;

/**
 * Sets numeric range values for iD preset
 * @param {Object} value MapRules presetConfig object's numeric field property object.
 *
 */
const _setNumericRange = (value) => {
    const valCondition = value.valCondition;
    const values = value.values;
    let numericRange = {};
    if (valCondition === 3) numericRange.maxValue = Number(values[0]) - 1;
    if (valCondition === 4) numericRange.maxValue = Number(values[0]);
    if (valCondition === 5) numericRange.minValue = Number(values[0]) + 1;
    if (valCondition === 6) numericRange.minValue =  Number(values[0]);
    return numericRange;
};

exports.setNumericRange = _setNumericRange;

exports.makeNumeric = (value) => {
    return Object.assign(_setNumericRange(value), { type: 'number' });
};

exports.makeCombo = (value) => {
    const values = value.values;
    const combo = {  
        strings: {
            options: values.reduce((options, val) => {
                const [displayValue, value] = val.split(' - ');
                options[displayValue || value] = value || displayValue;
                return options;
            }, {})
        },
        type: 'combo' 
    };
    if (values.length === 1) combo.strings.options[''] = '';
    return combo;
};

/**
 * given presetConfig key/val object, makes iD-ish key/val object
 * @param {object} primaryTags primary key's tags
 * @return {object} iD-ish key/val object
 */
exports.getTags = (primaryTags) => {
    return primaryTags.reduce((tags, tag) => { 
        tags[tag.key] = tag.val; 
        return tags; 
    }, {}); 
};

exports.getiDDefaults = () => JSON.parse(JSON.stringify(ID_DEFAULTS));
