
exports.up = function(knex, Promise) {
    // 1. create users table
    // 2. insert public user, what we will assign to all preset configurations that currently exist in maprules.
    return knex.schema.raw(`
        CREATE TABLE \'users\' (
            \`id\` integer not null primary key,
            \'name\' text not null
        );

        INSERT INTO users(id, name) VALUES (0, 'public');
    `);
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('users');
};

