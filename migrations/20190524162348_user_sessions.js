
exports.up = function (knex, Promise) {
    return knex.schema.createTable('user_sessions', function (table) {
        table.string('id').primary().notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.string('user_agent').notNullable();
        table.integer('user_id').unsigned().notNullable();
        table.foreign('user_id').references('id').inTable('users');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('user_sessions');
};
