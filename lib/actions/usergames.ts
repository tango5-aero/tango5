'use server';

import { Duration } from 'luxon';
import { currentUser } from '@clerk/nextjs/server';
import { getUserGames } from '~/lib/db/queries';
import {
    deleteUserGame as deleteDBUserGame,
    writeUserGame,
    deleteUserGames,
    getUserGamesPage as getDBUserGamesPage
} from '~/lib/db/queries';
import { UserGameInsert } from '~/lib/db/schema';
import { ActionState } from '.';
import { unstable_cache } from 'next/cache';
import { cacheTags } from '~/lib/constants';

export async function completeUserGame(scenarioId: number, playTimeMs: number, success: boolean) {
    const user = await currentUser();

    if (!user) {
        return;
    }

    const userGameScenarios = new Set((await getUserGames(user.id)).map((ug) => ug.scenarioId));
    if (userGameScenarios.has(scenarioId)) {
        return;
    }

    const playTime = Duration.fromMillis(playTimeMs).toString();
    const userGame: UserGameInsert = {
        userId: user.id,
        scenarioId,
        playTime,
        success
    };

    await writeUserGame(userGame);
}

export async function deleteUserGame(_prevState: ActionState, id: number): Promise<ActionState> {
    const res = await deleteDBUserGame(id);

    if (res.length === 0) {
        return { message: `UserGame #${id} not found`, error: true };
    }

    return { message: `UserGame #${id} deleted`, error: false };
}

export async function resetUserProgress(_prevState: ActionState, userId: string): Promise<ActionState> {
    try {
        await deleteUserGames(userId);
    } catch {
        return { message: `Error deleting games for user #${userId}`, error: true };
    }

    return { message: `Games for user #${userId} deleted`, error: false };
}

export async function getUserGamesPage(pageIndex: number, pageSize: number) {
    const getCachedUserGamesPage = unstable_cache(
        async (pageIndex, pageSize) => getDBUserGamesPage(pageIndex, pageSize),
        [cacheTags.userGames, pageIndex.toString(), pageSize.toString()],
        {
            tags: [cacheTags.userGames]
        }
    );
    return await getCachedUserGamesPage(pageIndex, pageSize);
}
