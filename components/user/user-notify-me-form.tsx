'use client';

import { PropsWithoutRef } from 'react';
import { updateConsent } from '~/lib/actions/users';

const UserNotifyMeForm = (props: PropsWithoutRef<{ consent: boolean }>) => {
    const onChangeConsent = (e: React.ChangeEvent<HTMLInputElement>) => {
        const consent = e.target.checked;
        updateConsent(consent);
    };

    return (
        <div className="flex flex-row gap-5">
            <label className="hover:cursor-pointer">
                <input
                    className="hover:cursor-pointer"
                    type="checkbox"
                    defaultChecked={props.consent}
                    onChange={onChangeConsent}
                />{' '}
                {'Notify me on updates and new scenarios'}
            </label>
        </div>
    );
};

export { UserNotifyMeForm };
