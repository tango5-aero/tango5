'use client';

import { PropsWithoutRef, startTransition, useState, useEffect } from 'react';
import { setScenarioReleaseDate } from '~/lib/actions';
import { CalendarCog } from 'lucide-react';
import { cacheTags } from '~/lib/constants';
import { DatePicker } from '../ui/date-picker';
import { ActionDialog } from '../ui/action-dialog';
import { useDialogAction } from '~/hooks/use-dialog-action';
import { ScenarioParsed } from '~/lib/types';
import { format } from 'date-fns';

export const ScenarioReleaseDateDialog = (props: PropsWithoutRef<Pick<ScenarioParsed, 'id' | 'releaseDate'>>) => {
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState(props.releaseDate ? new Date(props.releaseDate) : undefined);
    const { action, pending } = useDialogAction(
        'Setting release date for scenario...',
        setScenarioReleaseDate,
        cacheTags.scenarios
    );

    useEffect(() => {
        setDate(props.releaseDate ? new Date(props.releaseDate) : undefined);
    }, [open, props.releaseDate]);

    const handleConfirm = () => {
        startTransition(async () => {
            action({ id: props.id, releaseDate: date ? format(date, 'yyyy-MM-dd') : null });
            setOpen(false);
        });
    };

    return (
        <ActionDialog
            open={open}
            openHandler={setOpen}
            title={'Scenario Release Date'}
            pending={pending}
            dialogTrigger={<CalendarCog size={'1rem'} />}
            onConfirm={handleConfirm}>
            <DatePicker date={date} onSelect={setDate} />
        </ActionDialog>
    );
};
