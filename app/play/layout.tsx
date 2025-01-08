import { PropsWithChildren } from 'react';
import { UserBadge } from '~/components/user/user-badge';

export default function DashBoardLayout({ children }: PropsWithChildren) {
    return (
        <>
            <UserBadge /> {children}
        </>
    );
}
