import { pgTable, serial, text } from 'drizzle-orm/pg-core';
import { type InferSelectModel } from 'drizzle-orm';

export const ScenariosTable = pgTable('scenarios', {
    id: serial('id').primaryKey(),
    data: text('data')
});

export type Scenario = InferSelectModel<typeof ScenariosTable>;
