import { PropsWithChildren } from 'react';
import { SupportButton } from '~/components/ui/support-button';

export default function DashBoardLayout({ children }: PropsWithChildren) {
    return (
        <>
            <SupportButton />
            {children}
        </>
    );
}
