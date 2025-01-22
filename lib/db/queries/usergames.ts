import { eq } from 'drizzle-orm';
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
