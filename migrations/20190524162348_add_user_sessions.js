
exports.up = function (knex, Promise) {
    return knex.schema.raw(`
        CREATE TABLE \'user_sessions\' (
            \'id\' text not null primary key,
            \'user_id\' integer not null,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );
    `)
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('user_sessions');
};
