'use strict';

const seedData = require('./special');

// adds user, user session, and presets needed to
exports.seed = async(knex) => {
    try {
        await knex('presets').del();
        return Promise.all(seedData.presets.map(function(preset) {
            return knex('presets').insert({
                id: preset.id,
                preset: JSON.stringify(preset.config),
                user_id: seedData.user.id
            });
        }));
    } catch (error) {
        console.error(error);

    }
};

seed();
