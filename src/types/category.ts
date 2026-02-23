/**
 * type of category
 */
export type CategoryType = 'income' | 'expense';

/**
 * interface for category DTO
 */
export interface CategoryDto {
	id: number;
	name: string;
	type: CategoryType;
}
