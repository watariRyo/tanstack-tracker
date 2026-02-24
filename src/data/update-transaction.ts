import { createServerFn } from '@tanstack/react-start';
import { addDays } from 'date-fns';
import type { ControlledTransaction } from 'kysely';
import z from 'zod';
import authMiddleware from '@/auth-middleware';
import { getDb } from '@/database/database';
import type { Database } from '@/database/types';
import { toTransactionDto } from '@/types/transaction-mapper';

const schema = z.object({
	id: z.number(),
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

export const updateTransaction = createServerFn({
	method: 'POST',
})
	.middleware([authMiddleware])
	.inputValidator((data: z.infer<typeof schema>) => {
		return schema.parse(data);
	})
	.handler(async ({ context, data }) => {
		const userId = context.userId;
		const db = getDb();

		let trx: ControlledTransaction<Database, []> | undefined;
		try {
			trx = db.isTransaction
				? (db as ControlledTransaction<Database, []>)
				: await db.startTransaction().execute();
			const [updateTransaction] = await trx
				.updateTable('transactions')
				.set({
					amount: data.amount,
					transaction_date: new Date(data.transactionDate),
					category_id: data.categoryId,
					description: data.description,
				})
				.where((eb) =>
					eb.and([eb('id', '=', data.id), eb('user_id', '=', userId)]),
				)
				.returningAll()
				.execute();
			await trx.commit().execute();

			if (!updateTransaction) {
				return null;
			}

			return toTransactionDto(updateTransaction);
		} catch (error) {
			if (trx) {
				await trx.rollback().execute();
			}
			throw new Error('Failed to create transaction', { cause: error });
		}
	});
