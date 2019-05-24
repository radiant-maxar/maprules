'use strict';

const Boom = require('@hapi/boom');
const db = require('../../connection');
const uuidv4 = require('uuid/v4');

module.exports = async (r, h) => {
    try {
        const presets = r.payload;
        const uuid = uuidv4();

        await db.raw(`INSERT INTO presets VALUES ('${uuid}', json('${JSON.stringify(presets)}'))`);
        return h.response({ upload: 'successful', id: uuid }).code(200);

    } catch (error) {
        return Boom.badImplementation(error.message);

    }

};
