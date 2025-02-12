import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { PropsWithChildren } from 'react';
import { Footer } from '~/components/ui/footer';
import { Navbar } from '~/components/ui/navbar';

export default async function Layout({ children }: PropsWithChildren) {
    const user = await currentUser();
    const allowBackstage = (await auth()).sessionClaims?.metadata?.backstage === true;

    if (!user) {
        redirect('/');
    }
    return (
        <>
            <Navbar backstageAccess={allowBackstage} />
            {children}
            <Footer />
        </>
    );
}
