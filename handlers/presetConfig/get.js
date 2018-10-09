'use strict';

const db = require('../../connection');
const ensureExtant = require('../helpers').ensureExtant;

module.exports = async (r, h) => {
    try {
        const uuid = r.params.id;
        await ensureExtant(uuid);

        const query = await db.select('preset').from('presets').where({id: uuid});
        const config = JSON.parse(query[0].preset);
        return h.response(config).code(200);
    } catch (error) {
        return error;

    }
};