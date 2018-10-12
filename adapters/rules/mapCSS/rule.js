'use strict';

/**
 * 
 * @param {Object} rule config for mapcss tag selector 
 * @param {String} osmType osmType that prepends tag selector
 * @return {String} mapcss selector
 */
module.exports = (rule, osmType) => {
    const isClosed = osmType === 'closedway';
    const fieldConditionals = rule.fieldConditionals;
    const toThrow = rule.toThrow;

    let selectors = '';
    if (fieldConditionals !== undefined) {
        selectors += fieldConditionals.map(fieldConditional => {
        
            let selector = `${isClosed ? 'way': osmType}${rule.base}${fieldConditional}`;
            if (isClosed) {
                selector += ':closed';
            }
            
            return selector;

        }).join(fieldConditionals.length > 1 ? ',\n' : '');

    } else {
        selectors += `${isClosed ? 'way' : osmType}${rule.base}`;
    
    }
    return `${selectors}{
        ${toThrow}: "${rule.message}";
    }\n`;
};
