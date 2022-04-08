import fn from 'knex';
import envVar from './envVar.js';

const knex = fn({
    client: 'mysql2',
    connection: {
        host: envVar.DB_HOST,
        port: envVar.DB_PORT,
        user: envVar.DB_USER,
        password: envVar.DB_PASS,
        database : envVar.DB_NAME

    }
});
export default knex;