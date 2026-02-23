import type { Category as DbCategory } from '@/database/types';
import type { CategoryDto } from '@/types/category';

/**
 * transforms a database category entity into a DTO for client use
 */
export function toCategoryDto(dbCategory: DbCategory): CategoryDto {
	return {
		id: dbCategory.id,
		name: dbCategory.name,
		type: dbCategory.type,
	};
}

/**
 * transforms multiple database category entities into an array of DTOs
 */
export function toCategoryDtos(dbCategories: DbCategory[]): CategoryDto[] {
	return dbCategories.map(toCategoryDto);
}
