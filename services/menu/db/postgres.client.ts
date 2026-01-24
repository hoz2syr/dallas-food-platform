import { Client } from 'pg';

const client = new Client({
  host: process.env.POSTGRES_HOST || process.env.POSTGRES_SERVICE || 'postgres',
  port: Number(process.env.POSTGRES_PORT || 5432),
  database: process.env.POSTGRES_DB || 'dallas',
  user: process.env.POSTGRES_USER || 'dallas',
  password: process.env.POSTGRES_PASSWORD || 'dallas',
});

(async () => {
  try {
    await client.connect();
  } catch (err) {
    console.error('Postgres (menu) initialization error:', err && (err.message || err));
    process.exit(1);
  }
})();

export { client };
