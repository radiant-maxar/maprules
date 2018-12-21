'use strict';
const parseMapCSS = require('mapcss-parse').parse;
const adaptRules = require('../../adapters/rules');
const Boom = require('boom');
const db = require('../../connection');
const uuidv4 = require('uuid/v4');

module.exports = async (r, h) => {
    try {
        const mapcss = r.payload;
        const rulesMapCSS = parseMapCSS(mapcss);
        
        return h.response(rulesMapCSS).header('Content-Type', 'application/json').code(200);

    } catch (error) {
        return Boom.badImplementation(error.message);

    }

};
