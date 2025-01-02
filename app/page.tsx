import { Fragment } from 'react';
import { Map } from '~/components/map';
import { UserBadge } from '~/components/user-badge';

export default function App() {
    return (
        <Fragment>
            <UserBadge />
            <Map />
        </Fragment>
    );
}
