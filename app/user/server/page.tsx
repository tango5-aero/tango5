import { currentUser } from '@clerk/nextjs/server';

export default async function Page() {
    const user = await currentUser();

    if (!user) return <div>Not signed in</div>;

    return <pre>{JSON.stringify(user, null, 2)}</pre>;
}
