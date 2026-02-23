import type {
	ColumnType,
	Generated,
	Insertable,
	Selectable,
	Updateable,
} from 'kysely';

export interface Database {
	categories: CategoriesTable;
	transactions: TransactionsTable;
}

export interface CategoriesTable {
	id: Generated<number>;
	name: string;
	type: 'income' | 'expense';
}

export type Category = Selectable<CategoriesTable>;
export type NewCategory = Insertable<CategoriesTable>;
export type CategoryUpdate = Updateable<CategoriesTable>;

export interface TransactionsTable {
	id: Generated<number>;
	user_id: string;
	description: string;
	amount: number;
	transaction_date: Date;
	category_id: number;
	created_at: ColumnType<Date, string | undefined, never>;
	updated_at: ColumnType<Date, string | undefined, never>;
}

export type Transaction = Selectable<TransactionsTable>;
export type NewTransaction = Insertable<TransactionsTable>;
export type TransactionUpdate = Updateable<TransactionsTable>;
