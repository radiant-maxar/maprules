'use strict';

const db = require('../../connection');
const adaptRules = require('../../adapters/rules');
const ensureExtant = require('../helpers').ensureExtant;

module.exports = async (r, h) => {
    try {
        const uuid = r.params.id;
        await ensureExtant(uuid);

        const query = await db('presets').select('preset').where({ id: uuid });
        const config = JSON.parse(query[0].preset);
        const rulesMapCSS = adaptRules(config);
        
        return h.response(rulesMapCSS).code(200).header('Content-Type', 'text/css').header('X-Content-Type-Options', 'nosniff');

    } catch (error) {
        return error;
        
    }
};