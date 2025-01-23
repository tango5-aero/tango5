'use server';

import { unstable_cache } from 'next/cache';
import { getUsersPage as getDBUsersPage } from '~/lib/db/queries';
import { cacheTags } from '~/lib/constants';

const getCachedUsers = unstable_cache(
    async (pageIndex, pageSize) => getDBUsersPage(pageIndex, pageSize),
    [cacheTags.users]
);

export async function getUsersPage(pageIndex: number, pageSize: number) {
    return await getCachedUsers(pageIndex, pageSize);
}
