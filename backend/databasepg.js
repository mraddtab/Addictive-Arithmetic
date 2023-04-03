const { Pool} = require('pg');

const pool = new Pool({
    host: 'localhost',
    database: 'postgres',
    user: 'postgres',
    password: 'Monsterx3$$',
    port: 5432,
});

pool.connect();

module.exports = pool;
