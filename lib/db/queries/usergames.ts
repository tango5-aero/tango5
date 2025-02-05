import { currentUser } from '@clerk/nextjs/server';
import { and, avg, count, eq } from 'drizzle-orm';
import { db } from '~/lib/db';
import { UserGamesTable } from '~/lib/db/schema';
import { UserGameInsert, UserGameSelect } from '~/lib/types';

export const writeUserGame = async (userGame: UserGameInsert) => {
    return await db
        .insert(UserGamesTable)
        .values(userGame)
        .onConflictDoNothing({ target: [UserGamesTable.userId, UserGamesTable.scenarioId] })
        .returning();
};

export const getUserGames = async (userId?: UserGameInsert['userId']) => {
    const query = db.select().from(UserGamesTable);

    if (userId) {
        query.where(eq(UserGamesTable.userId, userId));
    }

    return await query.execute();
};

export const deleteUserGame = async (id: UserGameSelect['id']) => {
    return await db.delete(UserGamesTable).where(eq(UserGamesTable.id, id)).returning();
};

export const deleteUserGames = async (userId: UserGameInsert['userId']) => {
    return await db.delete(UserGamesTable).where(eq(UserGamesTable.userId, userId)).returning();
};

export const getUserGamesPage = async (pageIndex: number, pageSize: number) => {
    try {
        const total = await db.select({ value: count() }).from(UserGamesTable);
        const values = await db
            .select()
            .from(UserGamesTable)
            .orderBy(UserGamesTable.id)
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

export const getCurrentUserGamesPage = async (pageIndex: number, pageSize: number) => {
    const user = await currentUser();

    if (!user) {
        return { count: 0, values: [] };
    }

    try {
        const total = await db
            .select({ value: count() })
            .from(UserGamesTable)
            .where(eq(UserGamesTable.userId, user.id));
        const values = await db
            .select()
            .from(UserGamesTable)
            .where(eq(UserGamesTable.userId, user.id))
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

export const getCurrentUserGamesPerformance = async () => {
    const user = await currentUser();

    if (!user) {
        return;
    }

    const [succeeded] = await db
        .select({
            value: count(),
            playTimeAvg: avg(UserGamesTable.playTime)
        })
        .from(UserGamesTable)
        .where(and(eq(UserGamesTable.userId, user.id), eq(UserGamesTable.success, true)));

    const [total] = await db.select({ value: count() }).from(UserGamesTable).where(eq(UserGamesTable.userId, user.id));

    return {
        succeeded: succeeded?.value,
        total: total?.value,
        playTimeAvg: succeeded?.playTimeAvg
    };
};
