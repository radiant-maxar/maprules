'use strict';

const db = require('../../connection');
const adaptIdPresets = require('../../adapters').iDPresets;
const ensureExtant = require('../helpers').ensureExtant;

const mergePrimaries = require('../../adapters/serialize').mergePrimaries;

module.exports = async (r, h) => {
    try {
        const uuid = r.params.id;
        await ensureExtant(uuid);
        
        const query = await db('presets').select('preset').where({ id: uuid });
        const config = mergePrimaries(JSON.parse(query[0].preset));
        return h.response(adaptIdPresets(config)).code(200);
    } catch (error) {
        return error;
        
    }
};