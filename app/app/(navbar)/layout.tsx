import { PropsWithChildren } from 'react';
import { Navbar } from '~/components/ui/navbar';

export default function DashBoardLayout({ children }: PropsWithChildren) {
    return (
        <>
            <Navbar />
            {children}
        </>
    );
}
