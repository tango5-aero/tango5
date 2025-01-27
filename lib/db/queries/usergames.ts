import { currentUser } from '@clerk/nextjs/server';
import { count, eq } from 'drizzle-orm';
import { db } from '~/lib/db';
import { UserGameInsert, UserGamesTable } from '~/lib/db/schema';

export const writeUserGame = async (userGame: UserGameInsert) => {
    return await db
        .insert(UserGamesTable)
        .values(userGame)
        .onConflictDoNothing({ target: [UserGamesTable.userId, UserGamesTable.scenarioId] })
        .returning();
};

export const getUserGames = async (userId?: string) => {
    const query = db.select().from(UserGamesTable);

    if (userId) {
        query.where(eq(UserGamesTable.userId, userId));
    }

    return await query.execute();
};

export const deleteUserGame = async (id: number) => {
    return await db.delete(UserGamesTable).where(eq(UserGamesTable.id, id)).returning();
};

export const deleteUserGames = async (userId: string) => {
    return await db.delete(UserGamesTable).where(eq(UserGamesTable.userId, userId)).returning();
};

export const getUserGamesPage = async (pageIndex: number, pageSize: number) => {
    try {
        const total = await db.select({ value: count() }).from(UserGamesTable);
        const values = await db.select().from(UserGamesTable).limit(pageSize).offset(pageIndex);
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
