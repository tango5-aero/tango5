import { currentUser } from '@clerk/nextjs/server';
import { UserResetAction } from '~/components/backstage/users/user-reset-action';

export default async function App() {
    const user = await currentUser();

    return (
        <main className="flex flex-col items-center justify-center gap-6 p-6 md:p-10">
            {user && <UserResetAction id={user.id} />}
        </main>
    );
}
