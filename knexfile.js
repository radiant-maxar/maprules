const path = require('path'); 
const dbPath = path.join(__dirname, 'db');
const dbFile = () => `maprules-${process.env.NODE_ENV || 'development'}.sqlite`;

const base =  {
    migrations: { tableName: 'knex_migrations'},
    client: 'sqlite3',
    connection: { filename: path.join(dbPath, dbFile()) },
    useNullAsDefault: true
};

module.exports = {
    testing: Object.assign(base, {}),
    development: Object.assign(base, {}),
    production: Object.assign(base, {})
};
