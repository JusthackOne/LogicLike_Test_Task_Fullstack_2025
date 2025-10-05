import fs from 'fs';
import path from 'path';
import { pool } from './pool.js';

const MIGRATIONS_TABLE = 'migrations';

export async function migrate() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(
      `CREATE TABLE IF NOT EXISTS ${MIGRATIONS_TABLE} (
        id SERIAL PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        run_on TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`
    );
    await client.query('COMMIT');

    const migrationsDir = path.resolve(path.dirname(new URL(import.meta.url).pathname), 'migrations');
    const files = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith('.sql'))
      .sort();

    for (const file of files) {
      const { rows } = await pool.query(`SELECT 1 FROM ${MIGRATIONS_TABLE} WHERE name = $1`, [file]);
      if (rows.length > 0) continue;
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
      const client2 = await pool.connect();
      try {
        await client2.query('BEGIN');
        await client2.query(sql);
        await client2.query(`INSERT INTO ${MIGRATIONS_TABLE}(name) VALUES ($1)`, [file]);
        await client2.query('COMMIT');
        // eslint-disable-next-line no-console
        console.log(`Applied migration: ${file}`);
      } catch (e) {
        await client2.query('ROLLBACK');
        throw e;
      } finally {
        client2.release();
      }
    }
  } finally {
    client.release();
  }
}

if (process.argv[1] && process.argv[1].endsWith('migrate.js')) {
  migrate()
    .then(() => {
      // eslint-disable-next-line no-console
      console.log('Migrations complete');
      return pool.end();
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

