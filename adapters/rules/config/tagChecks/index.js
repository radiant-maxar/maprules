'use strict';

const THROW_ERROR = require('../../../constants').THROW_ERROR;
const THROW_WARNING = require('../../../constants').THROW_WARNING;

const message = require('./message');
const fieldConditional = require('./fieldConditional');
const getToThrow = require('../../../helpers').getToThrow;
const impliesEqual = require('../../../helpers').impliesEqual;

/**
 * Provided field and primary key, 
 * replies array of configs defining mapcss selectors
 * @param {object} field field config from preset within presetConfig 
 * @param {object} primary primary tag config from field config
 * @return {array} array of configs defining mapcss selectors
 */
module.exports = (field, primary, presetName,) => {
    const keyCondition = Number(field.keyCondition);
    const values = field.values;
    const tagChecks = [];
    const tagCheckBase = primary.map(p => `[${p.key}=${p.val}]`).join('');
    const conditionalVerb = keyCondition === 0 ? 'must not' : keyCondition === 1 ? 'must' : 'may';

    tagChecks.push({
        base: tagCheckBase,
        fieldConditionals: [keyCondition !== 0 ? `[!${field.key}]` : `[${field.key}]`],
        toThrow: keyCondition !== 2 ? THROW_ERROR : THROW_WARNING,
        message: `'${presetName}' preset ${conditionalVerb} include ${field.key}`
    });

    if (keyCondition !== 0) {
        values.forEach((value) => {
            const checkType = value.valCondition > 2 || impliesEqual(values) ? 'numeric' : 'alpha';
                
            const messageBuilder = message[checkType];
            const fieldConditionBuilder = fieldConditional[checkType];

            tagChecks.push({
                base: tagCheckBase,
                toThrow: getToThrow(value),
                fieldConditionals: fieldConditionBuilder(field.key, value),
                message: messageBuilder(field.key, value)
            });
        });

    }
    
    return tagChecks;
};
