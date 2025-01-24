import { InferSelectModel, InferInsertModel } from 'drizzle-orm/table';
import { ScenariosTable, UserGamesTable, UsersTable } from './db/schema';
import { ScenarioData } from './domain/scenario';

type ScenarioSelect = InferSelectModel<typeof ScenariosTable>;

export type ScenarioParsed = Omit<ScenarioSelect, 'data'> & { data: ScenarioData };

export type UserGameInsert = InferInsertModel<typeof UserGamesTable>;
export type UserGameSelect = InferSelectModel<typeof UserGamesTable>;
export type UserSelect = InferSelectModel<typeof UsersTable>;
