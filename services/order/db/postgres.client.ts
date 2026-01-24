import { Client } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

const client = new Client({
  host: process.env.POSTGRES_HOST || process.env.POSTGRES_SERVICE || 'postgres',
  port: Number(process.env.POSTGRES_PORT || 5432),
  database: process.env.POSTGRES_DB || 'dallas',
  user: process.env.POSTGRES_USER || 'dallas',
  password: process.env.POSTGRES_PASSWORD || 'dallas'
});

// Connect and run initial schema migration. Fail fast if migration fails.
(async () => {
  try {
    await client.connect();
    const migrationsDir = path.join(__dirname, 'migrations');
    const migrationFile = path.join(migrationsDir, '001-create-orders-table.sql');
    if (fs.existsSync(migrationFile)) {
      const sql = fs.readFileSync(migrationFile, 'utf8');
      await client.query(sql);
    }
  } catch (err) {
    console.error('Postgres initialization error:', err && (err.message || err));
    // Fail fast
    process.exit(1);
  }
})();

export { client };
