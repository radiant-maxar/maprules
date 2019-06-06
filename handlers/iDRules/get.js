'use strict';

const db = require('../../connection');
const adaptRules = require('../../adapters/rules');
const parseMapCSS = require('mapcss-parse').parse;

module.exports = async (r, h) => {
    try {
        const uuid = r.params.id;

        const query = await db('presets').select('preset').where({ id: uuid });
        const config = JSON.parse(query[0].preset);
        const adaptedRules = adaptRules(config);
        const rulesMapCSS = adaptedRules.length ? parseMapCSS(adaptedRules) : [];

        return h.response(rulesMapCSS).header('Content-Type', 'application/json').code(200);
    } catch (error) {
        return error;

    }
};
