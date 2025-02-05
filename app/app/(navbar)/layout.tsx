import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { PropsWithChildren } from 'react';
import { Navbar } from '~/components/ui/navbar';

export default async function Layout({ children }: PropsWithChildren) {
    const user = await currentUser();

    if (!user) {
        redirect('/');
    }
    return (
        <>
            <Navbar />
            {children}
        </>
    );
}
