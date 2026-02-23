import type { Kysely } from "kysely";
import type { Database } from '../types'; 

export async function seedCategories(db: Kysely<Database>): Promise<void> {
    const existingCategories = await db.selectFrom('categories')
        .selectAll()
        .execute();

    if (existingCategories.length > 0) {
        console.log('Categories already existing. Skipping seeding process.');
        return;
    }

    await db.insertInto('categories')
            .values([
                { name: 'Salary', type: 'income' },
                { name: 'Rental Income', type: 'income' },
                { name: 'Business Income', type: 'income' },
                { name: 'Investments', type: 'income' },
                { name: 'Other', type: 'income' },
                { name: 'Housing', type: 'expense' },
                { name: 'Transport', type: 'expense' },
                { name: 'Food & Groceries', type: 'expense' },
                { name: 'Health', type: 'expense' },
                { name: 'Entertainment & Leisure', type: 'expense' },
                { name: 'Other', type: 'expense' }, 
            ]).
            execute();
}