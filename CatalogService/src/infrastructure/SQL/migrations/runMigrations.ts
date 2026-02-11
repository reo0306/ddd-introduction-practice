import { promises as fs } from 'fs';
import path from 'path';

import pool from '../db';

async function runMigrations(fileName: string) {
    try {
        const sqlFile = path.join(__dirname, fileName);
        const sql = await fs.readFile(sqlFile, 'utf-8');

        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            await client.query(sql);
            await client.query('COMMIT');
            console.log(`Migration ${fileName} executed successfully.`);
        } catch (e) {
            await client.query('ROLLBACK');
            console.error(`Error executing migration ${fileName}:`, e);
            throw e;
        } finally {
            client.release();
        }
    } catch (e) {
        console.error(`Failed to read migration file ${fileName}:`, e);
        throw e;
    }
}

if (require.main === module) {
    const fileName = process.argv[2];
    runMigrations(fileName)
        .then(() => {
            console.log('Migration completed.');
            process.exit(0);
        })
        .catch((e) => {
            console.error('Migration failed:', e);
            process.exit(1);
        });
}

export default runMigrations;