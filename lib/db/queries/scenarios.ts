import { count, and, eq, inArray, notInArray, sql } from 'drizzle-orm';
import { db } from '~/lib/db';
import { ScenariosTable, UserGamesTable } from '~/lib/db/schema';
import { ScenarioSelect, UserGameInsert } from '~/lib/types';

export const getScenarios = async () => {
    return await db.query.ScenariosTable.findMany();
};

export const getScenario = async (id: ScenarioSelect['id']) => {
    return await db.query.ScenariosTable.findFirst({ where: (scenario, { eq }) => eq(scenario.id, id) });
};

export const getUnplayedScenarios = async (userId: UserGameInsert['userId']) => {
    const sq = db
        .select({ scenario_id: UserGamesTable.scenarioId })
        .from(UserGamesTable)
        .where(eq(UserGamesTable.userId, userId))
        .as('sq');

    return await db
        .with(sq)
        .select()
        .from(ScenariosTable)
        .where(and(notInArray(ScenariosTable.id, db.select().from(sq)), eq(ScenariosTable.active, true)));
};

export const getRandom = async (ids?: Array<ScenarioSelect['id']>) => {
    const query = db.select().from(ScenariosTable);

    const whereClause = ids
        ? and(inArray(ScenariosTable.id, ids), eq(ScenariosTable.active, true))
        : eq(ScenariosTable.active, true);

    const res = await query
        .where(whereClause)
        .orderBy(sql`RANDOM()`)
        .limit(1)
        .execute();

    return res.at(0);
};

export const writeScenarios = async (scenariosData: Array<ScenarioSelect['data']>) => {
    const data = scenariosData.map((scenarioData) => ({ data: scenarioData }));
    return await db.insert(ScenariosTable).values(data).returning();
};

export const deleteScenario = async (id: ScenarioSelect['id']) => {
    return await db.delete(ScenariosTable).where(eq(ScenariosTable.id, id)).returning();
};

export const getScenariosPage = async (pageIndex: number, pageSize: number) => {
    try {
        const total = await db.select({ value: count() }).from(ScenariosTable);
        const values = await db
            .select()
            .from(ScenariosTable)
            .orderBy(ScenariosTable.id)
            .limit(pageSize)
            .offset(pageIndex);
        return {
            count: total[0]?.value,
            values
        };
    } catch {
        return { count: 0, values: [] };
    }
};

export const changeScenarioVisibility = async (id: ScenarioSelect['id'], active: ScenarioSelect['active']) => {
    try {
        return await db.update(ScenariosTable).set({ active }).where(eq(ScenariosTable.id, id)).returning();
    } catch {
        return [];
    }
};

export const changeScenarioIsDemo = async (id: ScenarioSelect['id'], demo: ScenarioSelect['demo']) => {
    try {
        return await db.update(ScenariosTable).set({ demo }).where(eq(ScenariosTable.id, id)).returning();
    } catch {
        return [];
    }
};

export const getDemoScenarios = async () => {
    return await db.select().from(ScenariosTable).where(eq(ScenariosTable.demo, true)).orderBy(ScenariosTable.id);
};

export const getUnplayedDemoScenarios = async (played: ScenarioSelect['id'][]) => {
    return await db
        .select()
        .from(ScenariosTable)
        .where(and(notInArray(ScenariosTable.id, played), eq(ScenariosTable.demo, true)));
};
