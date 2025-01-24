import { count, eq, and, inArray, notInArray, sql } from 'drizzle-orm';
import { ScenarioData, scenarioSchema } from '~/lib/domain/scenario';
import { db } from '~/lib/db';
import { ScenariosTable, UserGamesTable } from '~/lib/db/schema';
import { format } from 'date-fns';
import { DateString } from '~/types';

export const getScenarios = async () => {
    const res = await db.query.ScenariosTable.findMany();
    return res.map((row) => ({ ...row, data: scenarioSchema.parse(JSON.parse(row.data)) }));
};

export const getScenario = async (id: number) => {
    const res = await db.query.ScenariosTable.findFirst({ where: (scenario, { eq }) => eq(scenario.id, id) });
    return res ? { ...res, data: scenarioSchema.parse(JSON.parse(res.data)) } : res;
};

export const getUnplayedScenarios = async (userId: string, releaseDate?: DateString) => {
    const sq = db
        .select({ scenario_id: UserGamesTable.scenarioId })
        .from(UserGamesTable)
        .where(eq(UserGamesTable.userId, userId))
        .as('sq');

    const query = db.with(sq).select().from(ScenariosTable);

    let whereClause = notInArray(ScenariosTable.id, db.select().from(sq));
    if (releaseDate) {
        const whereWithDay = and(whereClause, eq(ScenariosTable.releaseDate, releaseDate));

        if (whereWithDay) {
            whereClause = whereWithDay;
        }
    }

    return await query.where(whereClause);
};

export const getRandom = async (ids?: number[]) => {
    const query = db.select().from(ScenariosTable);

    if (ids) {
        query.where(inArray(ScenariosTable.id, ids));
    }

    const res = await query
        .orderBy(sql`RANDOM()`)
        .limit(1)
        .execute();

    const first = res.at(0);

    return first ? { ...first, data: scenarioSchema.parse(JSON.parse(first.data)) } : first;
};

export const writeScenarios = async (scenariosData: ScenarioData[]) => {
    const data = scenariosData.map((scenarioData) => ({ data: JSON.stringify(scenarioData) }));
    const res = await db.insert(ScenariosTable).values(data).returning();
    return res.map((row) => ({ ...row, data: scenarioSchema.parse(JSON.parse(row.data)) }));
};

export const updateScenarioReleaseDate = async (id: number, releaseDate: Date | undefined) => {
    const res = await db
        .update(ScenariosTable)
        .set({ releaseDate: releaseDate ? format(releaseDate, 'yyyy-MM-dd') : null })
        .where(eq(ScenariosTable.id, id))
        .returning();

    return res.map((row) => ({ ...row, data: scenarioSchema.parse(JSON.parse(row.data)) }));
};

export const deleteScenario = async (id: number) => {
    const res = await db.delete(ScenariosTable).where(eq(ScenariosTable.id, id)).returning();
    return res.map((row) => ({ ...row, data: scenarioSchema.parse(JSON.parse(row.data)) }));
};

export const getScenariosPage = async (pageIndex: number, pageSize: number) => {
    try {
        const total = await db.select({ value: count() }).from(ScenariosTable);
        const values = await db.select().from(ScenariosTable).limit(pageSize).offset(pageIndex);
        return {
            count: total[0]?.value,
            values: values.map((row) => ({ ...row, data: scenarioSchema.parse(JSON.parse(row.data)) }))
        };
    } catch {
        return { count: 0, values: [] };
    }
};
