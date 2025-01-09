import { eq, sql } from 'drizzle-orm';
import { db } from '.';
import { ScenariosTable, UsersTable } from './schema';
import { Scenario, scenarioSchema } from '~/lib/domain/scenario';
import { User } from '~/lib/domain/user';

export const getScenarios = async () => {
    const res = await db.query.ScenariosTable.findMany();
    return res.map((row) => ({ ...row, data: scenarioSchema.parse(JSON.parse(row.data)) }));
};

export const getScenario = async (id: number) => {
    const res = await db.query.ScenariosTable.findFirst({ where: (scenario, { eq }) => eq(scenario.id, id) });
    return res ? { ...res, data: scenarioSchema.parse(JSON.parse(res.data)) } : res;
};

export const getRandom = async () => {
    const res = await db
        .select()
        .from(ScenariosTable)
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

export const deleteScenario = async (id: number) => {
    const res = await db.delete(ScenariosTable).where(eq(ScenariosTable.id, id)).returning();
    return res.map((row) => ({ ...row, data: scenarioSchema.parse(JSON.parse(row.data)) }));
};

export const getOrInsertUser = async (id: string) => {
    const res = await db.query.UsersTable.findFirst({ where: (user, { eq }) => eq(user.id, id) });
    return res || (await db.insert(UsersTable).values({ id }).returning()).at(0);
};

export const updateUser = async (user: User) => {
    await db
        .update(UsersTable)
        .set({ firstName: user.firstName, lastName: user.lastName })
        .where(eq(UsersTable.id, user.id));
};

export const getUsers = async () => {
    const res = await db.query.UsersTable.findMany();
    return res;
};
