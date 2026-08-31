const { Pool } = require('pg');

const poolConfig = { max: 10, idleTimeoutMillis: 30000, connectionTimeoutMillis: 5000 };
if (process.env.DATABASE_URL) {
  poolConfig.connectionString = process.env.DATABASE_URL;
} else {
  poolConfig.host = process.env.DB_HOST || 'localhost';
  poolConfig.port = Number(process.env.DB_PORT || 5432);
  poolConfig.database = process.env.DB_NAME || 'smart_civic';
  poolConfig.user = process.env.DB_USER || 'postgres';
  poolConfig.password = process.env.DB_PASSWORD || '';
}
if (process.env.NODE_ENV === 'production') poolConfig.ssl = { rejectUnauthorized: false };

const pool = new Pool(poolConfig);
pool.on('error', (error) => console.error('PostgreSQL pool error:', error.message));

const query = (text, params = []) => pool.query(text, params);
const testConnection = async () => { await query('SELECT 1'); return true; };

module.exports = { pool, query, testConnection };
