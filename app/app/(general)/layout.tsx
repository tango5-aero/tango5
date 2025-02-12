import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { PropsWithChildren } from 'react';
import { Navbar } from '~/components/ui/navbar';
import { SupportButton } from '~/components/ui/support-button';

export default async function Layout({ children }: PropsWithChildren) {
    const user = await currentUser();
    const allowBackstage = (await auth()).sessionClaims?.metadata?.backstage === true;

    if (!user) {
        redirect('/');
    }
    return (
        <>
            <SupportButton />
            <Navbar backstageAccess={allowBackstage} />
            {children}
        </>
    );
}
