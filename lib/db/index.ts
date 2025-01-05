import './env';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import * as schema from './schema';
import { Scenario } from '~/lib/scenario';
import { eq } from 'drizzle-orm';

export const db = drizzle(sql, { schema });

export const getScenarios = async () => {
    return db.query.ScenariosTable.findMany();
};

export const getScenario = async (id: number) => {
    return db.query.ScenariosTable.findFirst({ where: (scenario, { eq }) => eq(scenario.id, id) });
};

export const writeScenario = async (scenario: Scenario) => {
    return db
        .insert(schema.ScenariosTable)
        .values({
            data: JSON.stringify(scenario)
        })
        .returning();
};

export const deleteScenario = async (id: number) => {
    db.delete(schema.ScenariosTable).where(eq(schema.ScenariosTable.id, id));
};
