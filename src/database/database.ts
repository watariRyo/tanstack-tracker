import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import type { Database } from './types'; // this is the Database interface we defined earlier

let db: Kysely<Database> | null = null;

/**
 * provides a singleton instance of the Kysely database connection.
 * It initializes the connection on the first call and returns the same instance for subsequent calls.
 * @returns Kysely<Database>
 */
export const getDb = (): Kysely<Database> => {
	if (!db) {
		const dialect = new PostgresDialect({
			pool: new Pool({
				database: process.env.DATABASE_NAME || 'tracker',
				host: process.env.DATABASE_HOST || 'localhost',
				user: process.env.DATABASE_USER || 'postgres',
				password: process.env.DATABASE_PASSWORD || 'postgres',
				port: process.env.DATABASE_PORT
					? Number(process.env.DATABASE_PORT)
					: 5432,
				max: 10,
			}),
		});

		db = new Kysely<Database>({
			dialect,
			log: (event) => {
				if (event.level === 'query') {
					const q = event.query;
					const time = Math.round(event.queryDurationMillis * 100) / 100;
					console.log(
						`\u001b[34mkysely:sql\u001b[0m: [${q.sql}] parameters: [${q.parameters}] time: ${time}ms`,
					);
				}
			},
		});
	}

	return db;
};

/**
 * Closes the database connection if it exists.
 * Cleaning up resources when the application is shutting down.
 */
export const closeDb = async (): Promise<void> => {
	if (db) {
		await db.destroy();
		db = null;
	}
};

/**
 * Establishes a connection to the PostgreSQL database using Kysely and pg.
 */
export const connect = () => {
	const dialect = new PostgresDialect({
		pool: new Pool({
			database: process.env.DATABASE_NAME || 'tracker',
			host: process.env.DATABASE_HOST || 'localhost',
			user: process.env.DATABASE_USER || 'postgres',
			password: process.env.DATABASE_PASSWORD || 'postgres',
			port: process.env.DATABASE_PORT
				? Number(process.env.DATABASE_PORT)
				: 5432,
			max: 10,
		}),
	});
	const db = new Kysely<Database>({
		dialect,
		log: (event) => {
			const q = event.query;
			const time = Math.round(event.queryDurationMillis * 100) / 100;
			console.log(
				`\u001b[ 34mkysely:sql\u001b[0m: [${q.sql}] parameters: [${q.parameters}] time: ${time}`,
			);
		},
	});
	return db;
};
