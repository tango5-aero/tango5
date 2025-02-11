import { boolean, integer, interval, pgTable, serial, text, unique } from 'drizzle-orm/pg-core';
import { createdAt, updatedAt } from './schemaHelpers';

export const ScenariosTable = pgTable('scenarios', {
    id: serial('id').primaryKey(),
    data: text('data').notNull(),
    active: boolean('active').default(false).notNull(),
    createdAt,
    updatedAt
});
export const UsersTable = pgTable('users', {
    id: text('id').primaryKey(),
    consent: boolean('consent').default(false).notNull(),
    createdAt,
    updatedAt
});

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
        success: boolean('success').notNull(),
        createdAt,
        updatedAt
    },
    (t) => [unique('unique_id').on(t.userId, t.scenarioId)]
);
