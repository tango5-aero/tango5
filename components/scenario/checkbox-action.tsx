import { PropsWithoutRef, startTransition } from 'react';
import { CheckedState } from '@radix-ui/react-checkbox';
import { Checkbox } from '~/components/ui/checkbox';

export const CheckboxAction = (props: PropsWithoutRef<{ action: (value: boolean) => void; checked: boolean }>) => {
    const handleChange = (status: CheckedState) => {
        if (status === 'indeterminate') return;
        startTransition(async () => {
            props.action(status);
        });
    };

    return <Checkbox defaultChecked={props.checked} onCheckedChange={handleChange} />;
};
