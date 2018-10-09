'use strict';

const seeds = require('../testData/seeds');

const bluebird = require('bluebird');
const insertStatement = (id, presets) => `INSERT INTO presets VALUES ('${id}', json('${JSON.stringify(presets)}'))`;

exports.seed = async (knex) => {
    try {
        await knex('presets').del();
        return bluebird.map(seeds, async (seed) => {
            try {
                const id = seed.id;
                const presets = seed.presets;
                const sql = insertStatement(id, presets);

                await knex.raw(sql);

            } catch (error) {
                console.error(error);
            }
        });
    } catch (error) {
        throw error;
    }
};
