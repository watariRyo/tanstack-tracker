/**
 * @see https://kysely-org.github.io/kysely-apidoc/classes/Migrator.html#migratedown
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FileMigrationProvider, Migrator } from 'kysely';
import { connect } from './database';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function migrateDown() {
	const db = connect();
	const migrator = new Migrator({
		db,
		provider: new FileMigrationProvider({
			fs,
			path,
			migrationFolder: path.join(__dirname, 'migrations'),
		}),
	});

	const { error, results } = await migrator.migrateDown();

	results?.forEach((it) => {
		if (it.status === 'Success') {
			console.log(
				`Migrate down: ${it.migrationName} was executed successfully.`,
			);
		} else if (it.status === 'Error') {
			console.error(
				`Failed: ${it.migrationName} failed to execute migrate down.`,
			);
		}
	});

	if (error) {
		console.error('Migrate down failed with error:', error);
		process.exit(1);
	}

	await db.destroy();
}

migrateDown();
