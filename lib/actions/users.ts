'use server';

import { unstable_cache } from 'next/cache';
import { getUsersPage as getDBUsersPage } from '~/lib/db/queries';
import { cacheTags } from '~/lib/constants';

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
