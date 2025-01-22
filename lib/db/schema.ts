import { boolean, integer, interval, pgTable, serial, text, unique } from 'drizzle-orm/pg-core';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm/table';

export const ScenariosTable = pgTable('scenarios', {
    id: serial('id').primaryKey(),
    data: text('data').notNull()
});
export type ScenarioSelect = InferSelectModel<typeof ScenariosTable>;

export const UsersTable = pgTable('users', {
    id: text('id').primaryKey()
});
export type UserSelect = InferSelectModel<typeof UsersTable>;

export const UserGamesTable = pgTable(
    'usergames',
    {
        id: serial('id').primaryKey(),
        userId: text('user_id')
            .references(() => UsersTable.id, { onDelete: 'cascade' })
            .notNull(),
        scenarioId: integer('scenario_id')
            .references(() => ScenariosTable.id, { onDelete: 'cascade' })
            .notNull(),
        playTime: interval('play_time').notNull(),
        success: boolean('success').notNull()
    },
    (t) => ({
        unique: unique('unique_id').on(t.userId, t.scenarioId)
    })
);
export type UserGameInsert = InferInsertModel<typeof UserGamesTable>;
export type UserGameSelect = InferSelectModel<typeof UserGamesTable>;
