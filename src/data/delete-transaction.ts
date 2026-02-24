import { createServerFn } from '@tanstack/react-start';
import type { ControlledTransaction } from 'kysely';
import z from 'zod';
import authMiddleware from '@/auth-middleware';
import { getDb } from '@/database/database';
import type { Database } from '@/database/types';
import { toTransactionDto } from '@/types/transaction-mapper';

const schema = z.object({
	transactionId: z.number(),
});

export const deleteTransaction = createServerFn({
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
			const [deleteTransaction] = await trx
				.deleteFrom('transactions')
				.where((eb) =>
					eb.and([
						eb('id', '=', data.transactionId),
						eb('user_id', '=', userId),
					]),
				)
				.returningAll()
				.execute();
			await trx.commit().execute();

			if (!deleteTransaction) {
				return null;
			}

			return toTransactionDto(deleteTransaction);
		} catch (error) {
			if (trx) {
				await trx.rollback().execute();
			}
			throw new Error('Failed to create transaction', { cause: error });
		}
	});
