'use server';

import { TableObject } from '~/lib/db/queries';
import { getUsersPage as getDBUsersPage } from '~/lib/db/queries';

export async function getUsersPage(pageIndex: number, pageSize: number): Promise<TableObject> {
    return await getDBUsersPage(pageIndex, pageSize);
}
