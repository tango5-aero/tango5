import { eq, inArray, notInArray, sql } from 'drizzle-orm';
import { Scenario, scenarioSchema } from '~/lib/domain/scenario';
import { db } from '~/lib/db';
import { ScenariosTable, UserGamesTable } from '~/lib/db/schema';
import { format } from 'date-fns';

export const getScenarios = async () => {
    const res = await db.query.ScenariosTable.findMany();
    return res.map((row) => ({ ...row, data: scenarioSchema.parse(JSON.parse(row.data)) }));
};

export const getScenario = async (id: number) => {
    const res = await db.query.ScenariosTable.findFirst({ where: (scenario, { eq }) => eq(scenario.id, id) });
    return res ? { ...res, data: scenarioSchema.parse(JSON.parse(res.data)) } : res;
};

export const getUnplayedScenarios = async (userId: string) => {
    const sq = db
        .select({ scenario_id: UserGamesTable.scenarioId })
        .from(UserGamesTable)
        .where(eq(UserGamesTable.userId, userId))
        .as('sq');

    return await db
        .with(sq)
        .select()
        .from(ScenariosTable)
        .where(notInArray(ScenariosTable.id, db.select().from(sq)));
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

export const writeScenario = async (scenario: Scenario) => {
    const data = JSON.stringify(scenario);
    const res = await db.insert(ScenariosTable).values({ data }).returning();

    return res.map((row) => ({ ...row, data: scenarioSchema.parse(JSON.parse(row.data)) }));
};

export const updateScenarioReleaseDate = async (id: number, releaseDate: Date) => {
    const res = await db
        .update(ScenariosTable)
        .set({ releaseDate: format(releaseDate, 'yyyy-MM-dd') })
        .where(eq(ScenariosTable.id, id))
        .returning();

    return res.map((row) => ({ ...row, data: scenarioSchema.parse(JSON.parse(row.data)) }));
};

export const deleteScenario = async (id: number) => {
    const res = await db.delete(ScenariosTable).where(eq(ScenariosTable.id, id)).returning();
    return res.map((row) => ({ ...row, data: scenarioSchema.parse(JSON.parse(row.data)) }));
};
