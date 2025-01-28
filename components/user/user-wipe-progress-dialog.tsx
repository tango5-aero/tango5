'use client';

import { PropsWithoutRef, startTransition, useState } from 'react';
import { resetUserProgress } from '~/lib/actions';
import { HistoryIcon } from 'lucide-react';
import { ActionDialog } from '../ui/action-dialog';
import { useDialogAction } from '~/hooks/use-dialog-action';
import { useTableContext } from '~/hooks/use-table-context';

export const UserWipeProgressDialog = (props: PropsWithoutRef<{ id: string }>) => {
    const { forceRefresh } = useTableContext();
    const [open, setOpen] = useState(false);
    const { action, pending } = useDialogAction(`Wiping progress of user #${props.id}`, resetUserProgress);

    const handleConfirm = () => {
        startTransition(async () => {
            action(props.id);
            setOpen(false);
            forceRefresh();
        });
    };

    return (
        <ActionDialog
            open={open}
            openHandler={setOpen}
            title={'Reset user'}
            description={`Are you sure you want to reset the user's progress? This action cannot be undone.`}
            pending={pending}
            dialogTrigger={<HistoryIcon size={'1rem'} />}
            confirmButtonVariant={'destructive'}
            onConfirm={handleConfirm}
        />
    );
};
