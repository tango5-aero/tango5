import { eq } from 'drizzle-orm';
import { db } from '.';
import { ScenariosTable } from './schema';
import { Scenario, scenarioSchema } from '~/lib/domain/scenario';
import { unstable_cache } from 'next/cache';
import { cacheTags } from '~/lib/constants';

export const getScenarios = unstable_cache(
    async () => {
        const res = await db.query.ScenariosTable.findMany();
        return res.map((row) => ({ ...row, data: scenarioSchema.parse(JSON.parse(row.data)) }));
    },
    [cacheTags.scenarios],
    {
        revalidate: 3600,
        tags: [cacheTags.scenarios]
    }
);

export const getScenario = async (id: number) => {
    const res = await db.query.ScenariosTable.findFirst({ where: (scenario, { eq }) => eq(scenario.id, id) });
    return res ? { ...res, data: scenarioSchema.parse(JSON.parse(res.data)) } : res;
};

export const writeScenario = async (scenario: Scenario) => {
    const data = JSON.stringify(scenario);
    const res = await db.insert(ScenariosTable).values({ data }).returning();

    return res.map((row) => ({ ...row, data: scenarioSchema.parse(JSON.parse(row.data)) }));
};

export const deleteScenario = async (id: number) => {
    const res = await db.delete(ScenariosTable).where(eq(ScenariosTable.id, id)).returning();
    return res.map((row) => ({ ...row, data: scenarioSchema.parse(JSON.parse(row.data)) }));
};
