import { type Kysely, sql } from 'kysely';
import type { Database } from '@/database/types';

export async function up(db: Kysely<Database>): Promise<void> {
	// Create the enum type for category type
	await db.schema
		.createType('category_type')
		.asEnum(['income', 'expense'])
		.execute();

	// Create the "categories" table
	await db.schema
		.createTable('categories')
		.addColumn('id', 'integer', (col) => col.primaryKey().generatedAlwaysAsIdentity())
		.addColumn('name', 'varchar(255)', (col) => col.notNull())
		.addColumn('type', sql`category_type`, (col) => col.notNull())
		.execute();

	await db.schema
		.createTable('transactions')
		.addColumn('id', 'bigint', (col) => col.primaryKey().generatedAlwaysAsIdentity())
		.addColumn('user_id', 'varchar(255)', (col) => col.notNull())
		.addColumn('description', 'varchar(255)', (col) => col.notNull())
		.addColumn('amount', 'numeric', (col) => col.notNull())
		.addColumn('transaction_date', 'date', (col) => col.notNull())
		.addColumn('category_id', 'integer', (col) =>
			col.references('categories.id').notNull(),
		)
		.addColumn('created_at', 'timestamptz', (col) => col.defaultTo(sql`now()`).notNull())
		.addColumn('updated_at', 'timestamptz', (col) => col.defaultTo(sql`now()`).notNull())
		.execute();

	// create index
	await db.schema
		.createIndex('idx_transactions_user_id')
		.on('transactions')
		.column('user_id')
		.execute();
}

export async function down(db: Kysely<Database>): Promise<void> {
    await db.schema.dropIndex('idx_transactions_user_id').execute();
    await db.schema.dropTable('transactions').execute();
    await db.schema.dropTable('categories').execute();
    await db.schema.dropType('category_type').execute();
}
