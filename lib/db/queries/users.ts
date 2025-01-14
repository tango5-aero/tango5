import { db } from '~/lib/db';
import { UserSelect, UsersTable } from '~/lib/db/schema';

export const getUser = async (id: string) => {
    const res = await db.query.UsersTable.findFirst({ where: (user, { eq }) => eq(user.id, id) });
    return res;
};

// Try to insert and quit silently if user already exists
export const tryCreateUser = async (user: UserSelect) => {
    return await db.insert(UsersTable).values(user).onConflictDoNothing().returning();
};

export const getUsers = async () => {
    const res = await db.query.UsersTable.findMany();
    return res;
};
