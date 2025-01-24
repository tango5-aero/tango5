'use client';

import { PropsWithoutRef, startTransition, useState } from 'react';
import { Button } from '~/components/ui/button';
import { resetUserProgress } from '~/lib/actions';
import { TimerReset } from 'lucide-react';
import { ActionDialog } from '../ui/action-dialog';
import { useDialogAction } from '~/hooks/use-dialog-action';

export const UserResetAction = (props: PropsWithoutRef<{ id: string }>) => {
    const [open, setOpen] = useState(false);
    const { action, pending } = useDialogAction(`Resetting progress...`, resetUserProgress);

    const handleConfirm = () => {
        startTransition(async () => {
            action(props.id);
            setOpen(false);
        });
    };

    return (
        <ActionDialog
            open={open}
            openHandler={setOpen}
            title={'Reset progress'}
            description={'This action cannot be undone, are you sure you want to proceed?'}
            pending={pending}
            triggerAsChild
            dialogTrigger={
                <Button variant="destructive">
                    <TimerReset />
                    <span>{'Reset my progress'}</span>
                </Button>
            }
            confirmButtonVariant={'destructive'}
            onConfirm={handleConfirm}
        />
    );
};
