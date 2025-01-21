import { auth } from '@clerk/nextjs/server';
import { notFound } from 'next/navigation';
import { UsersTable } from '~/components/backstage/users/users-table';
import { getUsers, getUser } from '~/lib/db/queries';

export default async function App() {
    const { userId } = await auth();
    if (!userId) {
        return <main className="flex flex-col items-center justify-center gap-6 p-6 md:p-10">{notFound()};</main>;
    }

    const userData = await getUser(userId);
    const allUsers = await getUsers();

    return (
        <main className="flex flex-col items-center justify-center gap-6 p-6 md:p-10">
            <p>Your ID: {JSON.stringify(userData?.id)}</p>
            <div>
                <h3>All Users</h3>
                <UsersTable users={allUsers} />
            </div>
        </main>
    );
}
