/**
 * importaciones requeridas
 */
const { Pool } = require('pg'); // conjunto de conexiones 
require('dotenv').config()
// ----------------------------------------------------------------------------------
/**
 * Instancia de la clase Pool para utilizar el mismo objeto en cada consulta
 */

const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
});
//inicialización de la conexión
pool.connect()

module.exports = pool