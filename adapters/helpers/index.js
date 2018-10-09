'use strict';

const THROW_ERROR = require('../constants').THROW_ERROR;
const THROW_WARNING = require('../constants').THROW_WARNING;

// total wizard! thanks!
// https://stackoverflow.com/questions/10865025/merge-flatten-an-array-of-arrays-in-javascripts
const flattener = (elementsToFlatten) => {
    return elementsToFlatten.reduce((flatElements, element) => {
        return flatElements.concat(Array.isArray(element) ? flattener(element) : element);
    }, []);
};

/**
 * recursively flattens elements
 * @param {Array} elementsToFlatten 
 */
exports.flattenElements = (elementsToFlatten) => flattener(elementsToFlatten);

/**
 * Provided values object's keys, 
 * replies correct validation message type
 * @param {number} valCondition numeric enconding of value conditional
 * @return {string} validation message type
 */
exports.getToThrow = (valCondition) => valCondition !== 2 ? THROW_ERROR : THROW_WARNING;

/**
 * Adapts numeric equality found in presetConfig to a MapCSS numeric conditional,
 * then returns a base + secondary selector that utilizes that numeric conditional
 * @param {String} key String for base selector
 * @param {Object} value presetConfig value object
 * @return {String} MapCSS selector for numeric equality
 */
exports.adaptEqualityToConditional = (key, value) => {
    let equality = ''; 
    let vals;
    
    const values = value.values;
    const valCondition = value.valCondition;

    switch (valCondition) { /* eslint-disable */
        case 0:
            vals = values.map(e => `^${e}$`).join('|')
            equality += `!~/${vals}/`;
            break;
        case 1:
            vals = values.map(ne => `^${ne}$`).join('|');
            equality += `=~/${vals}/`;
            break;
        case 3:
            equality += `>= ${values[0]}`; 
            break;
        case 4:
            equality += `> ${values[0]}`; 
            break;
        case 5:
            equality += `<= ${values[0]}`;
            break;
        case 6:
            equality += `< ${values[0]}`;
            break;
        default:
            break;
    }    

    return `[${key}][${key} ${equality}]`;
};   


/**
 * Givena numeric value and valCondition, builds message...
 * @param {String} value numeric value 
 * @param {Number} valCondition number alias for numeric equality
 * @return {String} message to notify user when equality not met
 */
exports.adaptNumericToMessage = (value, valCondition) => {
    let message = '';
    if (valCondition === 3) message = `less than ${value}`;
    if (valCondition === 4) message = `less than or equal to ${value}`;
    if (valCondition === 5) message = `greater than ${value}`;
    if (valCondition === 6) message = `greater than or equal to ${value}`;
    return message;
}

/**
 * Given field values object, determines if combination of keyCondition and values
 * implies a numeric equality
 * @param {Object} values maprules preset configuration object
 * @return {boolean} true if is equality, false if not. 
 */
const _impliesEqual = (values) => values.findIndex(val => isNaN(val)) === -1
exports.impliesEqual = _impliesEqual;


/**
 * Given presetConfig's values object, 
 * uses extant properties to imply and reply if field should have a combobox or text field
 * @param {Object} values prestConfig's values object
 * @return {Boolean} true if field should have a combobox, false if text field is appropriate. 
 */
exports.valuesImplyCombo = (value) => 0 < value.valCondition && value.valCondition <= 2;

/**
 * Given presetConfig's values object, returns true if 'numeric' prop present
 * @param {Object} values presetConfig's values object
 * @return {Boolean} true if numeric present, false if not
 */
exports.valuesImplyNumeric = (value) => 2 < value.valCondition || _impliesEqual(value.values)

/**
 * Provided string(s), returns titlecase.
 * @param {String} string  string to make titlecase
 * @return {String} titlecase string
 */
exports.titleCase = (string) => {
    return string
        .split(/[^a-z0-9]+/i)
        .map(s => s[0].toUpperCase() + s.slice(1, s.length))
        .join(' ');
};

/**
 * Adds escape flag for special characters found in a string
 * @param {String} string String with special characters
 * @return {String} string with special characters escaped
 */
exports.escaped = (string) => {
    const matches = string.match(/[/{}\[\]().+*?^$]/g);
    if (matches) {
        matches.forEach((match, index) => {
            if (matches.indexOf(match) === index) {
                string = string.replace(new RegExp('\\' + match, 'g'), '\\' + match);
            }
        });
    }
    return string;
};

/**
 * If input is a preposition, this is true.
 * @param {String} test string
 * @return {boolean} true if test is a preposition, false if not. 
 */
const _isPreposition = (test) => {
    return [
        'above','across','after','at','around','before','behind','below',
        'beside','between','by','down','during','for','from','in','inside',
        'onto','of','off','on','out','through','to','under','up','with'
    ].indexOf(test) > -1;
}

/**
 * Returns text with spaces in place of underbars and words titlecased.
 * @param {String} string String to make look like a label
 * @return {String} transformed string
 */
exports.asLabel = (string) => string.split(/\s|_/).map((c) => {
    let word = c.toLowerCase();
    if (!_isPreposition(word)) {
        word = word[0].toUpperCase() + word.slice(1)
    }
    return word;
}).join(' ');
