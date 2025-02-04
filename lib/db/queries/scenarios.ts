import { count, and, eq, inArray, notInArray, sql } from 'drizzle-orm';
import { scenarioSchema } from '~/lib/domain/scenario';
import { db } from '~/lib/db';
import { ScenariosTable, UserGamesTable } from '~/lib/db/schema';
import { ScenarioParsed, UserGameInsert } from '~/lib/types';

export const getScenarios = async () => {
    const res = await db.query.ScenariosTable.findMany();
    return res.map((row) => ({ ...row, data: scenarioSchema.parse(JSON.parse(row.data)) }));
};

export const getScenario = async (id: ScenarioParsed['id']) => {
    const res = await db.query.ScenariosTable.findFirst({ where: (scenario, { eq }) => eq(scenario.id, id) });
    return res ? { ...res, data: scenarioSchema.parse(JSON.parse(res.data)) } : res;
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

export const getRandom = async (ids?: ScenarioParsed['id'][]) => {
    const query = db.select().from(ScenariosTable);

    if (ids) {
        query.where(inArray(ScenariosTable.id, ids));
    }

    const res = await query
        .where(eq(ScenariosTable.active, true))
        .orderBy(sql`RANDOM()`)
        .limit(1)
        .execute();

    const first = res.at(0);

    return first ? { ...first, data: scenarioSchema.parse(JSON.parse(first.data)) } : first;
};

export const writeScenarios = async (scenariosData: Array<ScenarioParsed['data']>) => {
    const data = scenariosData.map((scenarioData) => ({ data: JSON.stringify(scenarioData) }));
    const res = await db.insert(ScenariosTable).values(data).returning();
    return res.map((row) => ({ ...row, data: scenarioSchema.parse(JSON.parse(row.data)) }));
};

export const deleteScenario = async (id: ScenarioParsed['id']) => {
    const res = await db.delete(ScenariosTable).where(eq(ScenariosTable.id, id)).returning();
    return res.map((row) => ({ ...row, data: scenarioSchema.parse(JSON.parse(row.data)) }));
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
            values: values.map((row) => ({ ...row, data: scenarioSchema.parse(JSON.parse(row.data)) }))
        };
    } catch {
        return { count: 0, values: [] };
    }
};

export const changeScenarioVisibility = async (id: number, active: boolean) => {
    try {
        return await db.update(ScenariosTable).set({ active: active }).where(eq(ScenariosTable.id, id)).returning();
    } catch {
        return [];
    }
};
