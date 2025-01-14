import { eq, inArray, sql } from 'drizzle-orm';
import { db } from '.';
import { ScenariosTable, UserGame, UserGameTable, UsersTable } from './schema';
import { Scenario, scenarioSchema } from '~/lib/domain/scenario';
import { User } from '~/lib/db/schema';

export const getScenarios = async () => {
    const res = await db.query.ScenariosTable.findMany();
    return res.map((row) => ({ ...row, data: scenarioSchema.parse(JSON.parse(row.data)) }));
};

export const getScenario = async (id: number) => {
    const res = await db.query.ScenariosTable.findFirst({ where: (scenario, { eq }) => eq(scenario.id, id) });
    return res ? { ...res, data: scenarioSchema.parse(JSON.parse(res.data)) } : res;
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

export const deleteScenario = async (id: number) => {
    const res = await db.delete(ScenariosTable).where(eq(ScenariosTable.id, id)).returning();
    return res.map((row) => ({ ...row, data: scenarioSchema.parse(JSON.parse(row.data)) }));
};

export const getUser = async (id: string) => {
    const res = await db.query.UsersTable.findFirst({ where: (user, { eq }) => eq(user.id, id) });
    return res;
};

// Try to insert and quit silently if user already exists
export const tryCreateUser = async (user: User) => {
    return await db.insert(UsersTable).values(user).onConflictDoNothing().returning();
};

export const getUsers = async () => {
    const res = await db.query.UsersTable.findMany();
    return res;
};

export const writeUserGame = async (userGame: UserGame) => {
    return await db.insert(UserGameTable).values(userGame).onConflictDoNothing().returning();
};

export const getUserGames = async (userId: string) => {
    const res = await db.query.UserGameTable.findMany({ where: (usergame, { eq }) => eq(usergame.userId, userId) });
    return res;
};
