'use strict';

const buildItems = require('./items');

/**
 * Builds xml group element
 * @param {Object} config preset object from preset configuration
 * @return {Object} xml mappable object representing a JOSM flavor preset. 
 */
module.exports = (config) => {
    return { 
        '@name': config.name,
        '@icon': 'images/dialogs/edit.png',
        item: buildItems(config)
    };
};
