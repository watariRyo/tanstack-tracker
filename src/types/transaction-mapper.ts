import type { Transaction as DbTransaction } from '@/database/types';
import type { TransactionDto } from '@/types/transaction';
import type { CategoryDto } from './category';
import { toCategoryDto } from './category-mapper';

/**
 * trasforms a database transaction entity into a DTO for client use
 */
export function toTransactionDto(
	dbTransaction: DbTransaction & { category?: CategoryDto },
): TransactionDto {
	return {
		id: dbTransaction.id,
		userId: dbTransaction.user_id,
		description: dbTransaction.description,
		amount: Number(dbTransaction.amount),
		transactionDate: new Date(dbTransaction.transaction_date),
		categoryId: dbTransaction.category_id,
		category: dbTransaction.category
			? toCategoryDto(dbTransaction.category)
			: undefined,
		createdAt: new Date(dbTransaction.created_at),
		updatedAt: new Date(dbTransaction.updated_at),
	};
}

/**
 * trasforms multiple database transaction entities into an array of DTOs for client use
 */
export function toTransactionDtos(
	dbTransactions: (DbTransaction & { category?: any })[],
): TransactionDto[] {
	return dbTransactions.map(toTransactionDto);
}
