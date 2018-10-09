'use strict';

const db = require('../../connection');

const ensureExtant = require('../helpers').ensureExtant;
const adaptJosmPresets = require('../../adapters').josmPresets;
const mergePrimaries = require('../../adapters/serialize').mergePrimaries;

module.exports = async (r, h) => {
    try {
        const uuid = r.params.id;
        await ensureExtant(uuid);

        const query = await db('presets').select('preset').where({ id: uuid });
        const config = mergePrimaries(JSON.parse(query[0].preset));
        const presetXML = await adaptJosmPresets(config);

        return h.response(presetXML).code(200).header('Content-Type', 'text/xml');

    } catch (error) {
        return error;
        
    }
};