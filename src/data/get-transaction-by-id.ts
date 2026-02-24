import { createServerFn } from '@tanstack/react-start';
import z from 'zod';
import authMiddleware from '@/auth-middleware';
import { getDb } from '@/database/database';
import { toTransactionGetByIdDto } from '@/types/transaction-mapper';

const schema = z.object({
	transactionId: z.number(),
});

export const getTransactionById = createServerFn({
	method: 'GET',
})
	.middleware([authMiddleware])
	.inputValidator((data: z.infer<typeof schema>) => {
		return schema.parse(data);
	})
	.handler(async ({ context, data }) => {
		const userId = context.userId;
		const db = getDb();

		const [transaction] = await db
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
					eb('transactions.id', '=', data.transactionId),
					eb('user_id', '=', userId),
				]),
			)
			.execute();

		if (!transaction) {
			return null;
		}

		return toTransactionGetByIdDto(transaction);
	});
