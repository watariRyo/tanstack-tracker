import { connect } from './database';
import { seedCategories } from './seeds/categories-seed-data';

async function runSeeds() {
	const db = connect();

	try {
		console.log('Starting database seeding...');

		// Seed categories data to the database.
		await seedCategories(db);

		console.log('Database seeding completed successfully.');
	} catch (error) {
		console.error('Seeding failed with error:', error);
		process.exit(1);
	} finally {
		await db.destroy();
	}
}

runSeeds();
