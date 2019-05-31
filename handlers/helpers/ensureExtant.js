'use strict';

const db = require('../../connection');
const Boom = require('@hapi/boom');

/**
 * Heartburn inducing helper function to make sure not to try to operate,
 * on row of db when it in actuality is non-extant.
 * @param {String} id string uuid of (potentially) a row in the db
 * @return {} empty promise when id found, rejected promise when not found.
 */
module.exports = (id, userId) => {
    return new Promise(async (resolve, reject) => {
        const where = { id: id };
        if (userId) where.user_id = userId;
        const result = await db.count('id').from('presets').where(where);
        const extant = result[0]['count(`id`)'] > 0;
        if (!extant) reject(Boom.notFound());
        resolve();
    });
};