import { boolean, integer, interval, pgTable, serial, text } from 'drizzle-orm/pg-core';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm/table';

export const ScenariosTable = pgTable('scenarios', {
    id: serial('id').primaryKey(),
    data: text('data').notNull()
});

export const UsersTable = pgTable('users', {
    id: text('id').primaryKey()
});

export const UserGameTable = pgTable('usergame', {
    id: serial('id').primaryKey(),
    userId: text('user_id')
        .references(() => UsersTable.id, { onDelete: 'cascade' })
        .notNull(),
    scenarioId: integer('scenario_id')
        .references(() => ScenariosTable.id, { onDelete: 'cascade' })
        .notNull(),
    playTime: interval('play_time').notNull(),
    success: boolean('success').notNull()
});

export type User = InferSelectModel<typeof UsersTable>;
export type UserGame = InferInsertModel<typeof UserGameTable>;
