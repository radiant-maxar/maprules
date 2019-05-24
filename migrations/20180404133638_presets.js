'use strict';

exports.up = function(knex, Promise) {
    return knex.schema.raw(`
        CREATE TABLE \`presets\` (
            \`id\` uuid not null primary key,
            \'preset\' JSON1
        );
    `);

};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('presets');
};
