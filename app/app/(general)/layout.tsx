import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { PropsWithChildren } from 'react';
import { Footer } from '~/components/ui/footer';
import { Navbar } from '~/components/ui/navbar';
import { SupportButton } from '~/components/ui/support-button';
import { getUnplayedScenarios } from '~/lib/db/queries';

export default async function Layout({ children }: PropsWithChildren) {
    const user = await currentUser();
    const allowBackstage = (await auth()).sessionClaims?.metadata?.backstage === true;

    if (!user) {
        redirect('/');
    }

    const allScenariosCompleted = (await getUnplayedScenarios(user.id)).length === 0;

    return (
        <>
            <SupportButton />
            <Navbar backstageAccess={allowBackstage} playDisabled={allScenariosCompleted} />
            {children}
            <Footer />
        </>
    );
}
