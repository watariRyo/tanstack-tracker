import { createServerFn } from '@tanstack/react-start';
import { sql } from 'kysely';
import z from 'zod';
import authMiddleware from '@/auth-middleware';
import { getDb } from '@/database/database';
import type { CashFlowDto } from '@/types/transaction';

const schema = z.object({
	year: z.number(),
});

export const getAnnualCashflow = createServerFn({
	method: 'GET',
})
	.middleware([authMiddleware])
	.inputValidator((data: z.infer<typeof schema>) => {
		return schema.parse(data);
	})
	.handler(async ({ context, data }) => {
		const db = getDb();
		const cashflow = await db
			.selectFrom('transactions')
			.innerJoin('categories', 'categories.id', 'transactions.category_id')
			.select([
				sql<string>`EXTRACT(MONTH FROM transaction_date)`.as('month'),
				sql<string>`SUM(CASE WHEN categories.type = 'income' THEN amount ELSE 0 END)`.as(
					'total_income',
				),
				sql<string>`SUM(CASE WHEN categories.type = 'expense' THEN amount ELSE 0 END)`.as(
					'total_expense',
				),
			])
			.where((eb) =>
				eb.and([
					eb('user_id', '=', context.userId),
					eb(
						sql<string>`EXTRACT(YEAR FROM transaction_date)`,
						'=',
						data.year.toString(),
					),
				]),
			)
			.groupBy(sql<string>`EXTRACT(MONTH FROM transaction_date)`)
			.orderBy('month', 'asc')
			.execute();

		const annualCachflow: CashFlowDto[] = [];

		for (let i = 0; i < 12; i++) {
			const monthlyCachflow = cashflow.find((cf) => Number(cf.month) === i + 1);
			annualCachflow.push({
				month: i,
				income: Number(monthlyCachflow?.total_income ?? 0),
				expense: Number(monthlyCachflow?.total_expense ?? 0),
			});
		}

		return annualCachflow;
	});
