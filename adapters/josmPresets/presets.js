'use strict';

const buildGroup = require('./group');

/**
 * Provided presetConfig, replies preset xml config
 * @param {Object} config presetConfig object
 * @return {Object} preset xml config
 */
module.exports = (config) => { 
    return { 
        group: buildGroup(config) 
    }; 
};