'use client';

import { PropsWithoutRef, startTransition, useState } from 'react';
import { deleteScenario } from '~/lib/actions';
import { Trash2Icon } from 'lucide-react';
import { cacheTags } from '~/lib/constants';
import { ActionDialog } from '~/components/ui/action-dialog';
import { useDialogAction } from '~/hooks/use-dialog-action';
import { useTableContext } from '~/hooks/use-table-context';

export const ScenarioDeleteDialog = (props: PropsWithoutRef<{ id: number }>) => {
    const { forceRefresh } = useTableContext();
    const [open, setOpen] = useState(false);
    const { action, pending } = useDialogAction(`Deleting scenario #${props.id}`, deleteScenario, cacheTags.scenarios);

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
            title={'Delete scenario'}
            description={'Are you sure you want to delete the scenario? This action can not be undone.'}
            pending={pending}
            dialogTrigger={<Trash2Icon size={'1rem'} />}
            confirmButtonVariant={'destructive'}
            onConfirm={handleConfirm}
        />
    );
};
