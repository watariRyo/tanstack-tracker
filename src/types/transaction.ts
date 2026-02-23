import type { CategoryDto } from './category';

/**
 * type of transaction DTO
 */
export interface TransactionDto {
	id: number;
	userId: string;
	description: string;
	amount: number;
	transactionDate: Date;
	categoryId: number;
	category?: CategoryDto; // リレーション情報
	createdAt: Date;
	updatedAt: Date;
}
