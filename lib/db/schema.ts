import { pgTable, serial, text } from 'drizzle-orm/pg-core';

export const ScenariosTable = pgTable('scenarios', {
    id: serial('id').primaryKey(),
    data: text('data').notNull()
});
