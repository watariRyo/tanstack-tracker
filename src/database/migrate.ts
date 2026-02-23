/**
 * @see https://kysely-org.github.io/kysely-apidoc/classes/Migrator.html#migratetolatest
 */
import { promises as fs } from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FileMigrationProvider, Migrator } from 'kysely';
import { connect } from './database';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function migrateToLatest() {
	const db = connect();
	const migrator = new Migrator({
		db,
		provider: new FileMigrationProvider({
			fs,
			path,
			migrationFolder: path.join(__dirname, 'migrations'),
		}),
	});

	const { error, results } = await migrator.migrateToLatest();

	results?.forEach((it) => {
		if (it.status === 'Success') {
			console.log(`Migrated: ${it.migrationName} was executed successfully.`);
		} else if (it.status === 'Error') {
			console.error(`Failed: ${it.migrationName} failed to execute.`);
		}
	});

	if (error) {
		console.error('Migration failed with error:', error);
		process.exit(1);
	}

	await db.destroy();
}

migrateToLatest();
