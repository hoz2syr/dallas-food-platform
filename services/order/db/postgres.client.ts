import { Client } from 'pg';

const client = new Client({
  host: process.env.POSTGRES_HOST || process.env.POSTGRES_SERVICE || 'postgres',
  port: Number(process.env.POSTGRES_PORT || 5432),
  database: process.env.POSTGRES_DB || 'dallas',
  user: process.env.POSTGRES_USER || 'dallas',
  password: process.env.POSTGRES_PASSWORD || 'dallas'
});

// Connect immediately; consumers can use the exported client.
client.connect().catch((err) => {
  // Do not throw here; connection may be retried by orchestrator.
  console.error('Postgres client connection error:', err.message || err);
});

export { client };
