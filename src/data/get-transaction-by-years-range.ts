import { createServerFn } from '@tanstack/react-start';
import authMiddleware from '@/auth-middleware';
import { getDb } from '@/database/database';

export const getTransactionByYearsRange = createServerFn({
	method: 'GET',
})
	.middleware([authMiddleware])
	.handler(async ({ context }) => {
		const userId = context.userId;
		const db = getDb();
		const earlistYears = await db
			.selectFrom('transactions')
			.select('transaction_date')
			.where('user_id', '=', userId)
			.orderBy('transaction_date', 'asc')
			.limit(1)
			.execute();

		const today = new Date();
		const currentYear = today.getFullYear();

		const earlistYear =
			earlistYears.length > 0
				? earlistYears[0].transaction_date.getFullYear()
				: currentYear;

		const years = Array.from({ length: currentYear - earlistYear + 1 }).map(
			(_, i) => {
				return currentYear - i;
			},
		);
		return years;
	});
