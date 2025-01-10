import { pgTable, serial, text } from 'drizzle-orm/pg-core';
import { InferSelectModel } from 'drizzle-orm/table';

export const ScenariosTable = pgTable('scenarios', {
    id: serial('id').primaryKey(),
    data: text('data').notNull()
});

export const UsersTable = pgTable('users', {
    id: text('id').primaryKey()
});

export type User = InferSelectModel<typeof UsersTable>;
