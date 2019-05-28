
exports.up = function (knex, Promise) {
    // 1. make a temp database _presets_old;
    return knex.schema.renameTable('presets', '_presets_old')
        .then(function () {
            return knex.schema.alterTable('_presets_old', function (table) {
                // 2. initialize for all existing presets the 'public' user id
                table.integer('user_id').defaultTo(0);
            });
        })
        .then(function () { // 3. create the updated presets table with the user_id column
            // return knex.schema.raw(
            //     `CREATE TABLE 'presets'(
            //         'id' uuid not null primary key,
            //         'preset' JSON1,
            //         'user_id' INTEGER DEFAULT 0,
            //         FOREIGN_KEY(user_id) REFERENCES users(id)
            //     )`
            // );
            return knex.schema.createTable('presets', function (table) {
                table.uuid('id').notNullable();
                table.json('preset');
                table.integer('user_id').defaultTo(0).notNullable();
                table.foreign('user_id').references('id').inTable('users');
            });
        })
        .then(function () {
            return knex('presets').del();
        })
        .then(function () { // 4. insert all that's in the temp table into the presets table
            return knex.raw('INSERT INTO presets SELECT * from _presets_old;');
        })
        .then(function () { // 5. drop the temporary table...
            return knex.schema.dropTableIfExists('_presets_old');
        })
        .catch(function (error) { throw error; });
};

exports.down = function (knex, Promise) {
    // 1. copy presets to temp table
    return knex.schema.renameTable('presets', '_presets_old')
        .then(function () { // 2. make presets with just id and presets column
            return knex.schema.createTable('presets', function (table) {
                table.uuid('id').notNullable();
                table.json('preset');
            });
        })
        .then(function () {
            return knex('presets').del();
        })
        .then(function () { // 3. copy meaningful temp data back into presets table.
            return knex.raw('INSERT INTO presets select id, preset from _presets_old');
        })
        .then(function () { // 4. drop the temp table..
            return knex.schema.dropTableIfExists('_presets_old');
        });
};

