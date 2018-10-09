'use strict';

const db = require('../../connection');
const ensureExtant = require('../helpers').ensureExtant;

module.exports = async (r, h) => {
    try {
        const id = r.params.id;
        await ensureExtant(id);
        
        const presets = r.payload;
        
        await db.raw(`UPDATE presets SET preset = json('${JSON.stringify(presets)}') WHERE id = '${id}'`);
        return h.response({ update: 'successful' }).code(200);
        
    } catch (error) {
        return error;
    }

};