'use strict';

const builder = require('xmlbuilder');
const buildGroup = require('./group');

/**
 * Provided presetConfig, replies preset xml string
 * @param {Object} config 
 * @return {String} preset xml string
 */
module.exports = (config) => {
    try {
        const group = { group: buildGroup(config) };
        return builder.create({ preset: group }).end();
    } catch (error) {
        throw error;
    }
};
