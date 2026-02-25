import { createServerFn } from '@tanstack/react-start';
import authMiddleware from '@/auth-middleware';
import { getDb } from '@/database/database';
import { toTransactionGetWithCategoryDtos } from '@/types/transaction-mapper';

export const getRecentTransactions = createServerFn({
	method: 'GET',
})
	.middleware([authMiddleware])
	.handler(async ({ context }) => {
		const userId = context.userId;
		const db = getDb();

		const transactions = await db
			.selectFrom('transactions')
			.innerJoin('categories', 'categories.id', 'transactions.category_id')
			.select([
				'transactions.id',
				'transactions.user_id',
				'transactions.description',
				'transactions.amount',
				'transactions.transaction_date',
				'transactions.category_id',
				'transactions.created_at',
				'transactions.updated_at',
				'categories.name as category_name',
				'categories.type as category_type',
			])
			.where('user_id', '=', userId)
			.orderBy('transaction_date', 'desc')
			.limit(5)
			.execute();

		return toTransactionGetWithCategoryDtos(transactions);
	});
