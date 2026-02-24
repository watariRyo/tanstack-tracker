import { createServerFn } from '@tanstack/react-start';
import z from 'zod';
import authMiddleware from '@/auth-middleware';
import { getDb } from '@/database/database';
import { toTransactionGetByMonthDtos } from '@/types/transaction-mapper';

const today = new Date();

const schema = z.object({
	month: z.number().min(1).max(12),
	year: z
		.number()
		.min(today.getFullYear() - 100)
		.max(today.getFullYear()),
});

export const getTransactoinByMonth = createServerFn({
	method: 'GET',
})
	.middleware([authMiddleware])
	.inputValidator((data: z.infer<typeof schema>) => {
		return schema.parse(data);
	})
	.handler(async ({ context, data }) => {
		const userId = context.userId;
		const earliestDate = new Date(data.year, data.month - 1, 1);
		const latestDate = new Date(data.year, data.month, 0);

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
			.where((eb) =>
				eb.and([
					eb('user_id', '=', userId),
					eb('transaction_date', '>=', earliestDate),
					eb('transaction_date', '<=', latestDate),
				]),
			)
			.orderBy('transaction_date', 'desc')
			.execute();

		return toTransactionGetByMonthDtos(transactions);
	});
