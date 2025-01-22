'use server';

import { getUsersPage as getDBUsersPage } from '~/lib/db/queries';

export async function getUsersPage(pageIndex: number, pageSize: number) {
    return await getDBUsersPage(pageIndex, pageSize);
}
