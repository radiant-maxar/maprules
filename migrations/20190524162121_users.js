
exports.up = function(knex, Promise) {
    // 1. create users table
    return knex.schema.createTable('users', function(table) {
        table.integer('id').primary().unsigned().notNullable();
        table.string('name');
    }).then(function() {
        return knex('users').del();
    }).then(function() {
        // 2. insert public user,
        //    this is the user for all preset configurations
        //    that currently exist in maprules.
        return knex('users').insert({ id: 0, name: 'public' });
    }).catch(function(error) { throw error; });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('users');
};

