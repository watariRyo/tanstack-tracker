import { createServerFn } from '@tanstack/react-start';
import { addDays } from 'date-fns';
import type { ControlledTransaction } from 'kysely';
import z from 'zod';
import authMiddleware from '@/auth-middleware';
import { getDb } from '@/database/database';
import type { Database } from '@/database/types';
import { toTransactionDto } from '@/types/transaction-mapper';

export const transactionSchema = z.object({
	transactionType: z.enum(['income', 'expense']),
	categoryId: z.number().positive('Please select a category.'),
	transactionDate: z.string().refine((value) => {
		const parsedDate = new Date(value);
		return (
			!Number.isNaN(parsedDate.getTime()) &&
			parsedDate <= addDays(new Date(), 1)
		);
	}),
	amount: z.number().positive('Amount must be a positive number.'),
	description: z
		.string()
		.min(3, 'Description must be at least 3 characters long.')
		.max(255, 'Description cannot exceed 255 characters.')
		.or(z.literal('')),
});

export const createTransaction = createServerFn({
	method: 'POST',
})
	.middleware([authMiddleware])
	.inputValidator((data: z.infer<typeof transactionSchema>) => {
		return transactionSchema.parse(data);
	})
	.handler(async ({ data, context }) => {
		const userId = context.userId;
		const db = getDb();
		let trx: ControlledTransaction<Database, []> | undefined;
		try {
			trx = db.isTransaction
				? (db as ControlledTransaction<Database, []>)
				: await db.startTransaction().execute();
			const [insertTransaction] = await trx
				.insertInto('transactions')
				.values({
					user_id: userId,
					description: data.description,
					amount: data.amount,
					transaction_date: new Date(data.transactionDate),
					category_id: data.categoryId,
				})
				.returningAll()
				.execute();
			await trx.commit().execute();

			return toTransactionDto(insertTransaction);
		} catch (error) {
			if (trx) {
				await trx.rollback().execute();
			}
			throw new Error('Failed to create transaction', { cause: error });
		}
	});
