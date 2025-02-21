import { InferSelectModel, InferInsertModel } from 'drizzle-orm/table';
import { ScenariosTable, UserGamesTable, UsersTable } from './db/schema';
import { Scenario } from './domain/scenario';

export type ScenarioSelect = InferSelectModel<typeof ScenariosTable>;
export type UserGameInsert = InferInsertModel<typeof UserGamesTable>;
export type UserGameSelect = InferSelectModel<typeof UserGamesTable>;
export type UserSelect = InferSelectModel<typeof UsersTable>;

export type UserGameProps = {
    scenario: ScenarioSelect;
    remainingScenarios?: number;
    backstageAccess?: boolean;
    countdownRunning?: boolean;
    revealSolution?: boolean;
    demoMode?: boolean;
};

export type ScenarioUserGame = {
    data: Scenario;
    id: number;
    active: boolean;
    demo: boolean;
    createdAt: Date;
    updatedAt: Date;
};

export type CompleteDemoPayload = {
    played: ScenarioSelect['id'][];
};
