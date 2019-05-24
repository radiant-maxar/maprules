
exports.up = function (knex, Promise) {
    // 1. add the user_id column
    // 2. update all presets currently in table with public user...
    // 3. add foreign key constraint so future presets have to have a user!
    knex.schema.raw(`
        ALTER TABLE presets ADD user_id INTEGER;
        UPDATE presets SET user_id=0 WHERE user_id IS NULL;
        ALTER TABLE ADD CONSTRAINT FOREIGN_KEY(user_id) REFERENCES users(id);
    `)
};

exports.down = function(knex, Promise) {
    // 1. copy presets to temp table
    // 2. make presets with just id and presets column
    // 3. insert just id and presets columns back into presets
    // 4. drop the temp table..
    knex.schema.raw(`
        PRAGMA foreign_keys=off;

        BEGIN TRANSACTION;

        ALTER TABLE presets RENAME TO _presets_old;
        CREATE TABLE presets (
            \'id\' uuid not null primary key,
            \'preset\' JSON1
        );

        INSERT INTO presets SELECT id, preset FROM _presets_old;

        DROP TABLE IF EXISTS _presets_old;
        COMMIT;
        PRAGMA foreign_keys=on;
    `);
};
