import { count, eq } from 'drizzle-orm';
import { db } from '~/lib/db';
import { UsersTable } from '~/lib/db/schema';
import { UserSelect } from '~/lib/types';

export const getUser = async (id: UserSelect['id']) => {
    const res = await db.query.UsersTable.findFirst({ where: (user, { eq }) => eq(user.id, id) });
    return res;
};

// Try to insert and quit silently if user already exists
export const tryCreateUser = async (userId: string) => {
    const user = { id: userId, consent: false };
    return await db.insert(UsersTable).values(user).onConflictDoNothing().returning();
};

export const getUsers = async () => {
    const res = await db.query.UsersTable.findMany();
    return res;
};

export const getUsersPage = async (pageIndex: number, pageSize: number) => {
    try {
        const total = await db.select({ value: count() }).from(UsersTable);
        const values = await db.select().from(UsersTable).orderBy(UsersTable.id).limit(pageSize).offset(pageIndex);
        return {
            count: total[0]?.value,
            values
        };
    } catch {
        return { count: 0, values: [] };
    }
};
export const updateUserConsent = async (id: UserSelect['id']) => {
    return await db.update(UsersTable).set({ consent: true }).where(eq(UsersTable.id, id)).returning();
};
