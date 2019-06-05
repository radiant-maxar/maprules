'use strict';

const seedData = require('../testData/seeds');

// adds user, user session, and presets needed to
exports.seed = async (knex) => {
    try {
        await knex('users').del();
        await knex('users').insert(seedData.user);

        await knex('user_sessions').del();
        await knex('user_sessions').insert({
            id: seedData.session,
            created_at: new Date(),
            user_id: seedData.user.id,
            user_agent: seedData.fakeUserAgent
        });

        await knex('presets').del();
        return Promise.all(seedData.presets.map(function (preset) {
            return knex('presets').insert({
                id: preset.id,
                preset: JSON.stringify(preset.config),
                user_id: seedData.user.id
            });
        }));
    } catch (error) {
        throw error;
    }
};
