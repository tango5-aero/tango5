'use server';

import { unstable_cache } from 'next/cache';
import { getUsersPage as getDBUsersPage, getUser, updateUserConsent } from '~/lib/db/queries';
import { cacheTags } from '~/lib/constants';
import { currentUser } from '@clerk/nextjs/server';

export async function getUsersPage(pageIndex: number, pageSize: number) {
    const getCachedUsers = unstable_cache(
        async (pageIndex, pageSize) => getDBUsersPage(pageIndex, pageSize),
        [cacheTags.users, pageIndex.toString(), pageSize.toString()],
        {
            tags: [cacheTags.users]
        }
    );

    return await getCachedUsers(pageIndex, pageSize);
}
export async function getUserInfo() {
    const user = await currentUser();

    if (!user) {
        return;
    }
    return await getUser(user.id);
}
export async function updateConsent(consent: boolean) {
    const user = await currentUser();

    if (!user) {
        return;
    }
    return await updateUserConsent(user.id, consent);
}
