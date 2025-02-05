'use server';

import { currentUser } from '@clerk/nextjs/server';
import { unstable_cache } from 'next/cache';
import { cacheTags } from '~/lib/constants';
import {
    getUserGames,
    getUnplayedScenarios,
    getRandom,
    writeUserGame,
    deleteUserGame as deleteDBUserGame,
    deleteUserGames,
    getUserGamesPage as getDBUserGamesPage,
    getCurrentUserGamesPage as getDBCurrentUserGamesPage,
    getCurrentUserGamesPerformance as getDBCurrentUserGamesPerformance
} from '~/lib/db/queries';
import { UserGameInsert, UserGameSelect } from '~/lib/types';
import revalidateCacheTag, { ActionScenarioState, ActionState } from '.';

export async function completeUserGame(
    _prevState: ActionScenarioState,
    payload: Pick<UserGameInsert, 'scenarioId' | 'playTime' | 'success'>
): Promise<ActionScenarioState> {
    const user = await currentUser();
    const { scenarioId, playTime, success } = payload;

    if (!user) {
        return { error: true, errorMessage: 'User not found' };
    }

    const userGameScenarios = new Set((await getUserGames(user.id)).map((ug) => ug.scenarioId));
    if (userGameScenarios.has(scenarioId)) {
        return { error: true, errorMessage: `Scenario ${scenarioId} has already been played` };
    }

    const userGame: UserGameInsert = {
        userId: user.id,
        scenarioId,
        playTime,
        success
    };

    const res = await writeUserGame(userGame);

    if (res.length === 0) {
        return { error: true, errorMessage: 'Error saving user game' };
    }

    // After saving a new user game, invalidate cache for that entity
    revalidateCacheTag(cacheTags.userGames);

    const unplayedScenarios = await getUnplayedScenarios(user.id);

    if (unplayedScenarios.length === 0) {
        return { scenario: undefined, pendingScenarios: 0, error: false };
    }

    const scenario = await getRandom(unplayedScenarios.map((s) => s.id));

    if (!scenario) {
        return { error: true, errorMessage: 'Error getting next scenario' };
    }

    return { scenario, pendingScenarios: unplayedScenarios.length, error: false };
}

export async function deleteUserGame(_prevState: ActionState, id: UserGameSelect['id']): Promise<ActionState> {
    const res = await deleteDBUserGame(id);

    if (res.length === 0) {
        return { message: `UserGame #${id} not found`, error: true };
    }

    return { message: `UserGame #${id} deleted`, error: false };
}

export async function resetUserProgress(
    _prevState: ActionState,
    userId: UserGameInsert['userId']
): Promise<ActionState> {
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

export async function getCurrentUserGamesPage(pageIndex: number, pageSize: number) {
    return await getDBCurrentUserGamesPage(pageIndex, pageSize);
}

export async function getCurrentUserGamesPerformance() {
    return await getDBCurrentUserGamesPerformance();
}
