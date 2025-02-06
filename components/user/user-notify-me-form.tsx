'use client';

import { PropsWithoutRef } from 'react';
import { CheckedState } from '@radix-ui/react-checkbox';
import { updateConsent } from '~/lib/actions/users';
import { Checkbox } from '~/components/ui/checkbox';

const UserNotifyMeForm = (props: PropsWithoutRef<{ consent: boolean }>) => {
    const onChangeConsent = (value: CheckedState) => {
        if (value === 'indeterminate') return;
        updateConsent(value);
    };

    return (
        <div className="flex flex-row items-center justify-center gap-2">
            <Checkbox id="user-consent" defaultChecked={props.consent} onCheckedChange={onChangeConsent} />
            <label htmlFor="user-consent" className="hover:cursor-pointer">
                {'Notify me on updates and new scenarios'}
            </label>
        </div>
    );
};

export { UserNotifyMeForm };
