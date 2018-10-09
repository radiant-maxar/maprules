const seeds = require('./special');
const db = require('../connection');

Promise = require('bluebird');
const insertStatement = (id, presets) => `INSERT INTO presets VALUES ('${id}', json('${JSON.stringify(presets)}'))`;

async function seed () {
    try {
        await db('presets').del();
        return await Promise.map(seeds, async(seed) => {
            try {
                const id = seed.id, presets = seed.presets;
                await db.raw(insertStatement(id, presets));
                return process.exit(0);
            } catch (error) {
                console.error(error);
            }
        });
    } catch (error) {
        console.error(error);

    }
};

seed();
