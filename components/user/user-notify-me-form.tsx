'use client';

import { giveConsent } from '~/lib/actions/users';
import { Button } from '../ui/button';
import { PropsWithoutRef } from 'react';

const UserNotifyMeForm = (props: PropsWithoutRef<{ consent: boolean }>) => {
    return (
        <div className="flex flex-row gap-5">
            {props.consent ? (
                <h3 className="text-xl">{'You are already subscribed for new scenarios'}</h3>
            ) : (
                <>
                    <h3 className="text-xl">{'Keep me posted for new scenarios'}</h3>
                    <Button onClick={giveConsent}>Notify me!</Button>
                </>
            )}
        </div>
    );
};

export { UserNotifyMeForm };
