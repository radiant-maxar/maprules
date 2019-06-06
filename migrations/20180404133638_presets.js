'use strict';

exports.up = function (knex, Promise) {
    return knex.schema.createTable('presets', function (table) {
        table.uuid('id').primary().notNullable();
        table.text('preset').notNullable();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('presets');
};
