'use strict';

const db = require('../../connection');
const Boom = require('@hapi/boom');

/**
 * Heartburn inducing helper function to make sure not to try to operate,
 * on row of db when it in actuality is non-extant.
 * @param {String} id string uuid of (potentially) a row in the db
 * @return {} empty promise when id found, rejected promise when not found.
 */
module.exports = (id) => {
    return new Promise(async (resolve, reject) => {
        const extant = (await db.count('id').from('presets').where('id', id))[0]['count(`id`)'] > 0;
        if (!extant) reject(Boom.notFound());
        resolve();
    });
};