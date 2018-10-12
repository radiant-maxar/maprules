'use strict';

const adaptNumericToMessage = require('../../../../helpers').adaptNumericToMessage;

/**
 * builds a error message for alpha (so string based) rules
 * @param {Array} equalityValues list of equality values to be adapted to error messages
 * @param {Number} messageMatch numeric encoding of must/must not/may 
 * @return {String} error message
 */
const _alpha = (key, value) => {
    const valuesString = value.values.map(v => `'${v}'`).join(',');
    let conditionalMessage = '';
    if (value.valCondition === 0) conditionalMessage += 'must not';
    if (value.valCondition === 1) conditionalMessage += 'must';
    if (value.valCondition === 2) conditionalMessage += 'may';
    return `${key} ${conditionalMessage} be ${valuesString}`;
};
   
/**
 * builds a error message for numeric rules
 * @param {Array} equalityValues list of equality values to be adapted to error messages
 * @return {String} error message
 */
const _numeric =  (key, value) => {
    const valueString = adaptNumericToMessage(value.values[0], value.valCondition);
    return `${key} must be ${valueString}`;
};

module.exports = {
    alpha: _alpha,
    numeric: _numeric
};
