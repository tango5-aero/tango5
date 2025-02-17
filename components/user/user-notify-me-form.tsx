'use client';

import { PropsWithoutRef, useId } from 'react';
import { CheckedState } from '@radix-ui/react-checkbox';
import { updateConsent } from '~/lib/actions/users';
import { Checkbox } from '~/components/ui/checkbox';

const UserConsentForm = (props: PropsWithoutRef<{ consent: boolean }>) => {
    const id = useId();

    const onChangeConsent = (value: CheckedState) => {
        if (value === 'indeterminate') return;
        updateConsent(value);
    };

    return (
        <div className="flex flex-row items-center justify-center gap-2">
            <Checkbox id={id} defaultChecked={props.consent} onCheckedChange={onChangeConsent} />
            <label htmlFor={id} className="font-barlow text-lg font-light hover:cursor-pointer">
                {'Notify me on updates and new scenarios'}
            </label>
        </div>
    );
};

export { UserConsentForm };
