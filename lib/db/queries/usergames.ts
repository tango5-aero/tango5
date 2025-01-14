import { db } from '~/lib/db';
import { UserGameInsert, UserGamesTable } from '~/lib/db/schema';

export const writeUserGame = async (userGame: UserGameInsert) => {
    return await db.insert(UserGamesTable).values(userGame).onConflictDoNothing().returning();
};

export const getUserGames = async (userId: string) => {
    const res = await db.query.UserGamesTable.findMany({ where: (usergame, { eq }) => eq(usergame.userId, userId) });
    return res;
};
