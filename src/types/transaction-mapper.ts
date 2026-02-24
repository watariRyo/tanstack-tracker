import type {
	Transaction as DbTransaction,
	TransactionWithCategory,
} from '@/database/types';
import type {
	TransactionDto,
	TransactionGetByIdDto,
	TransactionGetByMonthDto,
} from '@/types/transaction';
import type { CategoryType } from './category';

/**
 * trasforms a database transaction entity into a DTO for client use
 */
export function toTransactionDto(dbTransaction: DbTransaction): TransactionDto {
	return {
		id: dbTransaction.id,
		userId: dbTransaction.user_id,
		description: dbTransaction.description,
		amount: Number(dbTransaction.amount),
		transactionDate: new Date(dbTransaction.transaction_date),
		categoryId: dbTransaction.category_id,
		createdAt: new Date(dbTransaction.created_at),
		updatedAt: new Date(dbTransaction.updated_at),
	};
}

/**
 * trasforms multiple database transaction entities into an array of DTOs for client use
 */
export function toTransactionDtos(
	dbTransactions: DbTransaction[],
): TransactionDto[] {
	return dbTransactions.map(toTransactionDto);
}

export function toTransactionGetByMonthDto(
	dbTransaction: TransactionWithCategory,
): TransactionGetByMonthDto {
	return {
		id: dbTransaction.id,
		description: dbTransaction.description,
		amount: Number(dbTransaction.amount),
		transactionDate: new Date(dbTransaction.transaction_date),
		category: dbTransaction.category_name ?? '',
		transactionType: dbTransaction.category_type as CategoryType,
	};
}

export function toTransactionGetByMonthDtos(
	dbTransactions: TransactionWithCategory[],
): TransactionGetByMonthDto[] {
	return dbTransactions.map(toTransactionGetByMonthDto);
}

export function toTransactionGetByIdDto(
	dbTransaction: TransactionWithCategory,
): TransactionGetByIdDto {
	return {
		id: dbTransaction.id,
		description: dbTransaction.description,
		amount: Number(dbTransaction.amount),
		transactionDate: new Date(dbTransaction.transaction_date),
		categoryId: dbTransaction.category_id,
	};
}
