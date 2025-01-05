import { eq } from 'drizzle-orm';
import { db } from '.';
import { ScenariosTable } from './schema';

export const getScenarios = async () => db.query.ScenariosTable.findMany();

export const getScenario = async (id: number) =>
    db.query.ScenariosTable.findFirst({ where: (scenario, { eq }) => eq(scenario.id, id) });

export const writeScenario = async (data: string) => db.insert(ScenariosTable).values({ data }).returning();

export const deleteScenario = async (id: number) =>
    db.delete(ScenariosTable).where(eq(ScenariosTable.id, id)).returning();
