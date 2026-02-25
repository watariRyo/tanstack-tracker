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
	createdAt: Date;
	updatedAt: Date;
}

export interface TransactionGetWithCategoryDto {
	id: number;
	description: string;
	amount: number;
	transactionDate: Date;
	category: string;
	transactionType: 'income' | 'expense';
}

export interface TransactionGetByIdDto {
	id: number;
	description: string;
	amount: number;
	transactionDate: Date;
	categoryId: number;
}

export type CashFlowDto = {
	month: number;
	income: number;
	expense: number;
};
