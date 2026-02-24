import { createServerFn } from '@tanstack/react-start';
import { getDb } from '@/database/database';
import { toCategoryDtos } from '@/types/category-mapper';

export const getCategories = createServerFn({
	method: 'GET',
}).handler(async () => {
	const db = getDb();

	const categories = await db.selectFrom('categories').selectAll().execute();

	if (!categories || categories.length === 0) {
		throw new Error('No categories found');
	}

	return toCategoryDtos(categories);
});
